'use client';

import { useRef, useState } from 'react';
import mammoth from 'mammoth';
import { pipeline } from '@xenova/transformers';
import * as webllm from '@mlc-ai/web-llm';

    const QUERY_STOP_WORDS = new Set([
        'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'can', 'did', 'do', 'does',
        'for', 'from', 'had', 'has', 'have', 'how', 'in', 'is', 'it', 'of', 'on',
        'or', 'that', 'the', 'this', 'to', 'was', 'were', 'what', 'when', 'where',
        'which', 'who', 'why', 'with',
    ]);

    const getLexicalScores = (query, chunks) => {
        const queryTerms = [...new Set((query.toLowerCase().match(/[a-z0-9]{2,}/g) || [])
            .filter((term) => !QUERY_STOP_WORDS.has(term)))];
        if (queryTerms.length === 0) return chunks.map(() => 0);

        const termFrequencies = chunks.map(({ text }) => {
            const frequencies = new Map();
            for (const term of text.toLowerCase().match(/[a-z0-9]{2,}/g) || []) {
                frequencies.set(term, (frequencies.get(term) || 0) + 1);
            }
            return frequencies;
        });

        const scores = termFrequencies.map((frequencies) => queryTerms.reduce((score, term) => {
            const frequency = frequencies.get(term) || 0;
            if (frequency === 0) return score;

            const documentFrequency = termFrequencies.filter((chunk) => chunk.has(term)).length;
            const inverseDocumentFrequency = Math.log(1 + (chunks.length - documentFrequency + 0.5) / (documentFrequency + 0.5));
            return score + inverseDocumentFrequency * (frequency * 2.2) / (frequency + 1.2);
        }, 0));
        const maxScore = Math.max(...scores);

        return maxScore > 0 ? scores.map((score) => score / maxScore) : scores;
    };

export default function RagWordSystem() {

    const [vectorDb, setVectorDb] = useState([]);
    const [query, setQuery] = useState('');
    const [retrievedContext, setRetrievedContext] = useState('');
    const [answer, setAnswer] = useState('');
    const [status, setStatus] = useState('Idle - Please upload a document');
    const [isLoading, setIsLoading] = useState(false);
    const llmEngine = useRef(null);
// "Llama-3.2-1B-Instruct-q4f16_1-MLC"
    const SELECTED_MODEL = "Qwen2.5-0.5B-Instruct-q4f16_1-MLC";

    // Vector helper functions: Cosine Similarity
    const dotProduct = (a, b) => a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magnitude = (arr) => Math.sqrt(arr.reduce((sum, val) => sum + val * val, 0));
    const cosineSimilarity = (a, b) => dotProduct(a, b) / (magnitude(a) * magnitude(b));

    // Basic character-based text chunking
    const chunkText = (text, size = 800, overlap = 160) => {
        const chunks = [];
        let index = 0;
        while (index < text.length) {
        chunks.push(text.substring(index, index + size));
        index += size - overlap;
        }
        return chunks;
    };

    // 1. Process Uploaded Word Document
    const handleFileUpload = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        setIsLoading(true);
        setStatus('Reading Word Document...');

        const reader = new FileReader();
        reader.onload = async (e) => {
        try {
            const arrayBuffer = e.target?.result;
            if (!(arrayBuffer instanceof ArrayBuffer)) {
            throw new Error('Failed to read the selected document.');
            }
            
            // Extract raw text right inside the browser
            const result = await mammoth.extractRawText({ arrayBuffer });
            const fullText = result.value;

            if (!fullText.trim()) {
            throw new Error("The document appears to be empty.");
            }

            // Chunk text
            setStatus('Splitting text into searchable pieces...');
            const chunks = chunkText(fullText);

            // Load embedding pipeline and vectorize text chunks
            setStatus('Downloading embedding model & vectorizing chunks (This takes a moment)...');
            const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');

            const temporaryDb = [];
            for (const [index, chunk] of chunks.entries()) {
                const output = await extractor(chunk, { pooling: 'mean', normalize: true });
                const embedding = Array.from(output.data);
                temporaryDb.push({ text: chunk, embedding, index });
            }

            setVectorDb(temporaryDb);
            setRetrievedContext('');
            setAnswer('');
            setStatus(`Success! Knowledge base ready with ${temporaryDb.length} text chunks.`);
        } catch (err) {
            console.error(err);
            setStatus(`Error: ${err.message || 'Failed to process document.'}`);
        } finally {
            setIsLoading(false);
        }
        };

        reader.onerror = () => {
        console.error(reader.error);
        setStatus(`Error: ${reader.error?.message || 'Failed to read the selected document.'}`);
        setIsLoading(false);
        };

        reader.readAsArrayBuffer(file);
    };

    // 2. Query the Local Knowledge Base (Semantic Search)
    const handleAskQuestion = async (e) => {
        e.preventDefault();
        if (!query.trim() || vectorDb.length === 0) return;

        setIsLoading(true);
        setStatus('Computing query embedding & searching vector store...');

        try {
        // Embed the user's question
        const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
        const output = await extractor(query, { pooling: 'mean', normalize: true });
        const queryEmbedding = Array.from(output.data);

        // Score chunks using Cosine Similarity
        const lexicalScores = getLexicalScores(query, vectorDb);
        const scoredChunks = vectorDb.map((item, index) => ({
            ...item,
            score: cosineSimilarity(queryEmbedding, item.embedding) * 0.6 + lexicalScores[index] * 0.4,
        }));

        // Avoid selecting only overlapping chunks and include nearby text for context.
        scoredChunks.sort((a, b) => b.score - a.score);
        const anchors = [];
        for (const chunk of scoredChunks) {
            if (anchors.every((anchor) => Math.abs(anchor.index - chunk.index) > 1)) {
                anchors.push(chunk);
            }
            if (anchors.length === 4) break;
        }

        const selectedIndexes = new Set();
        for (const anchor of anchors) {
            for (let index = Math.max(0, anchor.index - 1); index <= Math.min(vectorDb.length - 1, anchor.index + 1); index += 1) {
                selectedIndexes.add(index);
            }
        }
        const contextChunks = vectorDb.filter((chunk) => selectedIndexes.has(chunk.index));
        const contextText = contextChunks.map((chunk) => chunk.text).join('\n\n');
        setRetrievedContext(contextText);
        setAnswer('');
        
        // C. Engineer a strict prompt so WebLLM doesn't make things up
        const messages = [
            { 
            role: "system", 
            content: "You are a precise document analysis assistant. Search all of the provided context for information that directly answers the user's question, including equivalent wording. Answer using only that context and do not make up facts. Say 'I cannot find that information in the document.' only if no passage in the context supports an answer." 
            },
            { 
            role: "user", 
            content: `Context:\n${contextText}\n\nQuestion: ${query}` 
            }
        ];

        if (!llmEngine.current) {
            setStatus('Loading the low-resource language model...');
            llmEngine.current = await webllm.CreateMLCEngine(
                SELECTED_MODEL,
                {
                    initProgressCallback: (report) => {
                        setStatus(report.text);
                    }
                }
            );
        }

        const reply = await llmEngine.current.chat.completions.create({
            messages,
            stream: true
        });

        let fullAnswer = "";
        for await (const chunk of reply) {
            const delta = chunk.choices[0]?.delta?.content || "";
            fullAnswer += delta;
            setAnswer(fullAnswer);
        }
        setRetrievedContext(contextText);
        setStatus('Context retrieved successfully!');

        } catch (err) {
        console.error(err);
        const errorMessage = err?.message || 'Unknown error';
        if (/device was lost|device lost/i.test(errorMessage)) {
            llmEngine.current = null;
        }
        setStatus(`Error performing search: ${errorMessage}`);
        } finally {
        setIsLoading(false);
        }
    };


    return (
        <div className="min-h-0 flex-1 overflow-y-auto bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            
            {/* Navigation Head */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 pb-4 mb-6 gap-4">
            <div>
                {/* <div className="mb-2">
                <Link href="/dashboard" className="text-xs font-semibold text-indigo-600 hover:underline">
                    ← Back to Dashboard
                </Link>
                </div> */}
                <h1 className="text-2xl font-bold text-gray-900"> In-Browser Word Doc RAG System 🚀</h1>
                <p className="text-sm text-gray-500">Upload a .docx file to create a purely client-side AI knowledge base.</p>
            </div>
            
            {/* <div className="text-sm font-medium text-gray-500 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-md self-start sm:self-center">
                Total Records: <span className="text-indigo-600 font-bold">{totalCount}</span>
            </div> */}
            </div>
                <h1>Rag Word System</h1>
                {/* Upload Section */}
                <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg mb-5 text-center bg-gray-50 hover:bg-gray-100 transition-colors">
                    <input 
                    type="file" 
                    accept=".docx" 
                    onChange={handleFileUpload} 
                    disabled={isLoading} 
                    className={`block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 ${isLoading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                    />
                </div>

                {/* Outputs */}
                {retrievedContext && (
                    <div className="mt-6">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">📖 Retrieved Context Chunks</h3>
                    <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded-lg border border-gray-200 text-xs text-gray-600 max-h-48 overflow-y-auto font-mono">
                        {retrievedContext}
                    </pre>
                    </div>
                )}

                {answer && (
                    <div className="mt-6">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">🤖 AI Generation Output</h3>
                    <div className="whitespace-pre-wrap bg-emerald-50 p-4 rounded-lg border border-emerald-200 text-sm text-emerald-800 font-medium">
                        {answer}
                    </div>
                    </div>
                )}

                {/* Status Bar */}
                <div className="p-3 bg-blue-50 border border-blue-100 rounded-md text-sm text-blue-800 font-medium mb-5">
                    <span className="font-bold text-blue-900">Status:</span> {status}
                </div>

                {/* Query Section */}
                <form onSubmit={handleAskQuestion} className="flex gap-3 mb-6">
                    <input 
                    type="text" 
                    placeholder="Ask a question about the document..." 
                    value={query} 
                    onChange={(e) => setQuery(e.target.value)} 
                    disabled={isLoading || vectorDb.length === 0}
                    className="flex-grow p-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                    <button 
                    type="submit" 
                    disabled={isLoading || vectorDb.length === 0}
                    className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors shadow-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                    {isLoading ? 'Searching...' : 'Ask'}
                    </button>
                </form>

                
            </div>
            </div>
    )

}