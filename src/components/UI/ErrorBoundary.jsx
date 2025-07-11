import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { clearAppStorage } from '../../utils/commonUtils'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console
    console.error('ErrorBoundary caught an error', error, errorInfo)
    this.setState({ errorInfo })
    
    // You could send to an error reporting service here
    // Example: sendToErrorReportingService(error, errorInfo);
    
    // Log to localStorage for debugging purposes
    try {
      const errorLog = {
        timestamp: new Date().toISOString(),
        error: error.toString(),
        componentStack: errorInfo.componentStack,
        url: window.location.href
      }
      localStorage.setItem('kokonsa_error_log', JSON.stringify(errorLog))
    } catch (e) {
      console.error('Failed to log error to localStorage', e)
    }
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-gray-50 dark:bg-gray-900"
        >
          <motion.div 
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="card p-8 max-w-md w-full shadow-lg border-t-4 border-red-500 bg-white dark:bg-gray-800"
          >
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Something went wrong</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              We're sorry, but an error occurred while rendering this page.
            </p>
            
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-6 overflow-auto max-h-40 text-left">
              <p className="text-sm font-mono text-gray-700 dark:text-gray-300">
                {this.state.error && this.state.error.toString()}
              </p>
              {this.state.errorInfo && (
                <details className="mt-2">
                  <summary className="text-sm text-primary-600 dark:text-primary-400 cursor-pointer">View technical details</summary>
                  <pre className="mt-2 text-xs overflow-auto p-2 bg-gray-200 dark:bg-gray-600 dark:text-gray-300 rounded">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>
              )}
            </div>
            
            <div className="flex flex-col space-y-3">
              <motion.button 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => window.location.reload()}
                className="btn-primary bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium py-3 px-4 rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all duration-200"
              >
                Reload Page
              </motion.button>
              
              <Link to="/" className="btn-secondary text-center py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                Go to Home
              </Link>
              
              <button 
                onClick={() => {
                  // Clear any cached data that might be causing issues
                  try {
                    // Use the centralized storage clearing function
                    clearAppStorage();
                    console.log('Cache cleared');
                    // Preserve the theme setting
                    const theme = localStorage.getItem('theme');
                    if (theme) {
                      localStorage.setItem('theme', theme);
                    }
                    window.location.href = '/';
                  } catch (e) {
                    console.error('Failed to clear cache', e);
                  }
                }}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors mt-2"
              >
                Clear cache and restart
              </button>
            </div>
          </motion.div>
        </motion.div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary