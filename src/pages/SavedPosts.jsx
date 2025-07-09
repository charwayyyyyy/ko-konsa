import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bookmark, Grid3X3, List, Search, Filter, Trash2 } from 'lucide-react'
import { usePost } from '../contexts/PostContext'
import PostCard from '../components/Posts/PostCard'
import LoadingSpinner from '../components/UI/LoadingSpinner'
import toast from 'react-hot-toast'

const SavedPosts = () => {
  const { getSavedPosts, savePost } = usePost()
  const [viewMode, setViewMode] = useState('list')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [selectedPosts, setSelectedPosts] = useState([])
  const [showBulkActions, setShowBulkActions] = useState(false)
  
  const savedPosts = getSavedPosts()
  
  // Filter and sort posts
  const filteredPosts = savedPosts
    .filter(post => {
      if (!searchQuery) return true
      return post.content.toLowerCase().includes(searchQuery.toLowerCase())
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt)
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt)
        case 'mostLiked':
          return b.likes.length - a.likes.length
        case 'mostCommented':
          return b.comments.length - a.comments.length
        default:
          return 0
      }
    })
  
  const handleSelectPost = (postId) => {
    setSelectedPosts(prev => {
      const newSelection = prev.includes(postId)
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
      
      setShowBulkActions(newSelection.length > 0)
      return newSelection
    })
  }
  
  const handleSelectAll = () => {
    if (selectedPosts.length === filteredPosts.length) {
      setSelectedPosts([])
      setShowBulkActions(false)
    } else {
      setSelectedPosts(filteredPosts.map(post => post.id))
      setShowBulkActions(true)
    }
  }
  
  const handleBulkUnsave = async () => {
    try {
      await Promise.all(selectedPosts.map(postId => savePost(postId)))
      setSelectedPosts([])
      setShowBulkActions(false)
      toast.success(`Removed ${selectedPosts.length} posts from saved`)
    } catch (error) {
      toast.error('Failed to remove posts')
    }
  }
  
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'mostLiked', label: 'Most Liked' },
    { value: 'mostCommented', label: 'Most Commented' }
  ]
  
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
          <Bookmark className="text-yellow-600" size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Saved Posts</h1>
          <p className="text-gray-600">{savedPosts.length} saved posts</p>
        </div>
      </div>
      
      {/* Controls */}
      <div className="card p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Search */}
          <div className="relative flex-1 lg:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search saved posts..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Sort */}
            <div className="flex items-center space-x-2">
              <Filter size={16} className="text-gray-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            {/* View Mode */}
            <div className="flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-primary-100 text-primary-600'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                <List size={20} />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-primary-100 text-primary-600'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                <Grid3X3 size={20} />
              </motion.button>
            </div>
          </div>
        </div>
        
        {/* Bulk Actions */}
        <AnimatePresence>
          {showBulkActions && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleSelectAll}
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    {selectedPosts.length === filteredPosts.length ? 'Deselect All' : 'Select All'}
                  </button>
                  <span className="text-sm text-gray-600">
                    {selectedPosts.length} selected
                  </span>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleBulkUnsave}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                >
                  <Trash2 size={16} />
                  <span>Remove from Saved</span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Posts */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Bookmark size={48} className="mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {searchQuery ? 'No matching saved posts' : 'No saved posts yet'}
          </h3>
          <p className="text-gray-600">
            {searchQuery
              ? 'Try adjusting your search terms.'
              : 'Posts you save will appear here for easy access later.'
            }
          </p>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-6'}>
          <AnimatePresence>
            {filteredPosts.map((post) => (
              <motion.div
                key={post.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="relative"
              >
                {/* Selection Checkbox */}
                <div className="absolute top-4 left-4 z-10">
                  <motion.input
                    whileHover={{ scale: 1.1 }}
                    type="checkbox"
                    checked={selectedPosts.includes(post.id)}
                    onChange={() => handleSelectPost(post.id)}
                    className="w-5 h-5 text-primary-600 bg-white border-2 border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
                  />
                </div>
                
                <PostCard post={post} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
      
      {/* Load More Button (if needed for pagination) */}
      {filteredPosts.length > 0 && filteredPosts.length % 10 === 0 && (
        <div className="text-center mt-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-secondary"
          >
            Load More Posts
          </motion.button>
        </div>
      )}
    </div>
  )
}

export default SavedPosts