/** @type {import('next').NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: true,
  turbopack: {
    resolveAlias: {
      fs: { browser: './src/lib/empty-module.js' },
      path: { browser: './src/lib/empty-module.js' },
      url: { browser: './src/lib/empty-module.js' },
      sharp: { browser: './src/lib/empty-module.js' },
      'onnxruntime-node': { browser: './src/lib/empty-module.js' },
    },
  },
};

export default nextConfig;
