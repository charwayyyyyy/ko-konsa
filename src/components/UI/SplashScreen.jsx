import React from 'react';
import { motion } from 'framer-motion';
import LoadingSpinner from './LoadingSpinner';

/**
 * SplashScreen component that displays during initial app loading
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isVisible - Whether the splash screen is visible
 * @param {string} props.logoSrc - Source URL for the app logo
 * @param {string} props.appName - Name of the application
 * @param {string} props.loadingText - Text to display during loading
 */
const SplashScreen = ({
  isVisible,
  logoSrc = '/assets/images/logo.svg',
  appName = 'Kokonsa',
  loadingText = 'Starting Kokonsa...',
}) => {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-gray-900"
    >
      <div className="flex flex-col items-center justify-center p-8 rounded-lg">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-6"
        >
          <img 
            src={logoSrc} 
            alt={`${appName} Logo`} 
            className="w-24 h-24 md:w-32 md:h-32" 
          />
        </motion.div>
        
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mb-8 text-2xl font-bold text-center text-gray-800 dark:text-white md:text-3xl"
        >
          {appName}
        </motion.h1>
        
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <LoadingSpinner size="lg" text={loadingText} />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SplashScreen;