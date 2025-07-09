import React, { Component } from 'react'
import { Link } from 'react-router-dom'

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
    // You can log the error to an error reporting service
    console.error('ErrorBoundary caught an error', error, errorInfo)
    this.setState({ errorInfo })
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-gray-50">
          <div className="card p-8 max-w-md w-full">
            <h1 className="text-2xl font-bold text-red-500 mb-4">Something went wrong</h1>
            <p className="text-gray-600 mb-6">
              We're sorry, but an error occurred while rendering this page.
            </p>
            <div className="bg-gray-100 p-4 rounded-lg mb-6 overflow-auto max-h-40 text-left">
              <p className="text-sm font-mono text-gray-700">
                {this.state.error && this.state.error.toString()}
              </p>
            </div>
            <div className="flex flex-col space-y-3">
              <button 
                onClick={() => window.location.reload()}
                className="btn-primary"
              >
                Reload Page
              </button>
              <Link to="/" className="btn-secondary">
                Go to Home
              </Link>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary