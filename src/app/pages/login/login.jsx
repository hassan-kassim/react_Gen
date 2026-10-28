"use client";

import React, { useState } from 'react';
import { loginUser } from '../../../shared/services/authService';
import { toastService } from '../../../shared/services/toasterMessage';
import { useAuthStore } from '../../../shared/store/authStore'; // Import the store hook
import { useRouter } from 'next/navigation'; // Crucial: Next.js native navigation hook


export default function LoginPage() {
  const router = useRouter();
  // Pull values and actions directly from the store
  const loginAction = useAuthStore((state) => state.login);

  const [email, setEmail] = useState('user@example.com');
  const [password, setPassword] = useState('Password123!');
  const [rememberMe, setRememberMe] = useState(false);
  const [emailError, setEmailError] = useState('');

   // Network Request States
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  // Standard RFC 5322 Email Validation Regex
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\$/;

  const validateEmail = (value) => {
    if (!value) {
      setEmailError('Email address is required');
      return false;
    } 
    // else if (!emailRegex.test(value)) {
    //   setEmailError('Please enter a valid email address (e.g., name@example.com)');
    //   return false;
    // }
    setEmailError('');
    return true;
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    // Clear errors inline as the user fixes a wrong email format
    if (emailError) {
      if (emailRegex.test(value)) setEmailError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Run validation checks before submission
    const isEmailValid = validateEmail(email);

    if (isEmailValid) {
      console.log('Logging in with:', { email, password });

      // Proceed with API call here

        try {
            setIsLoading(true);
            
            // Execute the business layer service call directly
            const response = await loginUser(email, password);
            loginAction(response.user, response.token);
            toastService.success(`Success! Welcome back, ${response.user.name}.`);

            //set up router in to navigate to dashboard page after successful login
            router.push('/dashboard');
            console.log('Login Response:', response);
        } catch (err) {
            setApiError(err.message || 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-6 sm:px-6 lg:px-8">
      <div className="sm:mx-auto w-full sm:max-w-md">
        {/* Logo Placeholder */}
        <div className="flex justify-center text-indigo-600">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://w3.org">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
            create a new account
          </a>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto w-full sm:max-w-md">
         {apiError && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4 text-sm text-red-700">
              {apiError}
            </div>
          )}
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  disabled={isLoading}
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={(e) => validateEmail(e.target.value)}
                  className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 sm:text-sm transition-all ${
                    emailError 
                      ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                  }`}
                  placeholder="you@example.com"
                  aria-invalid={emailError ? "true" : "false"}
                  aria-describedby={emailError ? "email-error" : undefined}
                />
                {emailError && <p className="mt-2 text-sm text-red-600">{emailError}</p>}
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  disabled={isLoading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setRememberMe(checked);
                    console.log('Remember Me:', checked);
                  }}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 selection:bg-indigo-200">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
                  Forgot your password?
                </a>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                disabled={isLoading}
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
