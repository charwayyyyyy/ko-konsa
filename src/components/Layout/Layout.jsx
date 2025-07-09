import React from 'react'
import { motion } from 'framer-motion'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import RightSidebar from './RightSidebar'
import { useAuth } from '../../contexts/AuthContext'

const Layout = ({ children }) => {
  const { loading } = useAuth()
  
  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
    </div>
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
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