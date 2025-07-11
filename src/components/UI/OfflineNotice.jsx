import React from 'react';
import { motion } from 'framer-motion';
import { WifiOff } from 'lucide-react';

/**
 * OfflineNotice component that displays a notification when the user is offline
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isOffline - Whether the user is offline
 * @param {string} props.className - Additional CSS classes
 */
const OfflineNotice = ({ isOffline, className = '' }) => {
  if (!isOffline) return null;

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -100, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-center p-2 bg-red-500 text-white shadow-md ${className}`}
    >
      <div className="flex items-center space-x-2">
        <WifiOff size={18} />
        <span className="font-medium">You are offline. Some features may be unavailable.</span>
      </div>
    </motion.div>
  );
};

export default OfflineNotice;