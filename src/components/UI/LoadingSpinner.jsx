import React from 'react';
import { motion } from 'framer-motion';
import { spinnerVariants } from '../../utils/animationUtils';
import { cn } from '../../utils/commonUtils';

/**
 * LoadingSpinner component that displays a customizable loading animation
 * 
 * @param {Object} props - Component props
 * @param {string} props.size - Size of the spinner (sm, md, lg, xl)
 * @param {string} props.color - Color of the spinner
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.text - Optional loading text to display
 * @param {boolean} props.fullScreen - Whether to display the spinner in full screen
 */
const LoadingSpinner = ({ 
  size = 'md', 
  color = 'primary', 
  fullScreen = false, 
  text = '',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-3',
    xl: 'w-16 h-16 border-4'
  };

  const colorClasses = {
    primary: 'border-t-blue-500',
    accent: 'border-t-purple-500',
    gray: 'border-t-gray-500',
    white: 'border-t-white',
    success: 'border-t-green-500',
    danger: 'border-t-red-500',
    warning: 'border-t-yellow-500'
  };

  const containerClasses = fullScreen 
    ? 'fixed inset-0 flex flex-col items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50' 
    : 'flex flex-col items-center justify-center'

  return (
    <div className={containerClasses}>
      <motion.div
        variants={spinnerVariants}
        animate="animate"
        className={cn(
          `${sizeClasses[size]} border-gray-200 dark:border-gray-700 ${colorClasses[color]} border-t-transparent rounded-full`,
          className
        )}
        aria-label="Loading"
        role="status"
      />
      {text && <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 animate-pulse">{text}</p>}
    </div>
  )
}

export default LoadingSpinner