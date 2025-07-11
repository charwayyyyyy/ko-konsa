import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { initializeTheme } from './utils/themeUtils'

// Initialize theme before rendering
initializeTheme();

// Error tracking for React rendering
const logError = (error, errorInfo) => {
  console.error('React Error:', error);
  console.error('Error Info:', errorInfo);
  
  // Store error in localStorage for debugging
  try {
    const errorLog = {
      timestamp: new Date().toISOString(),
      error: error.toString(),
      stack: error.stack,
      info: errorInfo
    };
    localStorage.setItem('kokonsa_error_log', JSON.stringify(errorLog));
  } catch (e) {
    console.error('Failed to store error log:', e);
  }
  // Here you could send to an error tracking service
}

// Create root with error handling
const root = ReactDOM.createRoot(document.getElementById('root'));

// Handle render errors
try {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error) {
  logError(error, { componentStack: 'Root render' });
  
  // Fallback UI in case of critical error
  root.render(
    <div className="error-boundary-fallback p-8 flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 text-center">
      <div className="max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Something went wrong</h1>
        <p className="text-gray-700 dark:text-gray-300 mb-6">The application failed to load. Please try one of the following:</p>
        <div className="space-y-3">
          <button 
            onClick={() => window.location.reload()}
            className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
          >
            Refresh Page
          </button>
          <button 
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            className="w-full py-2 px-4 bg-gray-500 hover:bg-gray-600 text-white rounded-md transition-colors"
          >
            Clear Cache and Reload
          </button>
        </div>
      </div>
    </div>
  );
}