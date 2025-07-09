import React from 'react'
import { motion } from 'framer-motion'

const LoadingSpinner = ({ size = 'md', color = 'primary', fullScreen = false, text = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }

  const colorClasses = {
    primary: 'border-primary-500',
    accent: 'border-accent-500',
    gray: 'border-gray-500',
    white: 'border-white'
  }

  const containerClasses = fullScreen 
    ? 'fixed inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-50' 
    : 'flex flex-col items-center justify-center'

  return (
    <div className={containerClasses}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear'
        }}
        className={`${sizeClasses[size]} border-2 border-gray-200 ${colorClasses[color]} border-t-transparent rounded-full`}
      />
      {text && <p className="mt-3 text-sm text-gray-600">{text}</p>}
    </div>
  )
}

export default LoadingSpinner