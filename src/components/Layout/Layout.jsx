import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import RightSidebar from './RightSidebar';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../UI/LoadingSpinner';
import OfflineNotice from '../UI/OfflineNotice';
import { isOnline, registerConnectivityListeners } from '../../utils/offlineUtils';
import { pageTransitionVariants } from '../../utils/animationUtils';

const Layout = ({ children }) => {
  const { loading } = useAuth();
  const [isOffline, setIsOffline] = useState(!isOnline());
  
  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    // Register event listeners for online/offline status
    const cleanup = registerConnectivityListeners(handleOnline, handleOffline);
    
    return cleanup;
  }, []);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <AnimatePresence>
        <OfflineNotice isOffline={isOffline} />
      </AnimatePresence>
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24">
              <Sidebar />
            </div>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-6">
            <motion.div
              variants={pageTransitionVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {children}
            </motion.div>
          </div>
          
          {/* Right Sidebar */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24">
              <RightSidebar />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Layout