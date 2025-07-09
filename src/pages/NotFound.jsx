import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home } from 'lucide-react'

const NotFound = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col items-center justify-center p-4 text-center"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <h1 className="text-9xl font-bold text-primary-500">404</h1>
      </motion.div>
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mb-8 max-w-md"
      >
        <h2 className="text-2xl font-bold mb-2">Page Not Found</h2>
        <p className="text-gray-600">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
      </motion.div>
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <Link 
          to="/"
          className="btn-primary flex items-center justify-center gap-2"
        >
          <Home size={18} />
          Back to Home
        </Link>
      </motion.div>
    </motion.div>
  )
}

export default NotFound