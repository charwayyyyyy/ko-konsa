import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Crown, Heart, MessageCircle, TrendingUp } from 'lucide-react'
import { usePost } from '../../contexts/PostContext'
import { useUser } from '../../contexts/UserContext'
import { formatDistanceToNow } from '../../utils/dateUtils'

const KokonsaOfTheDay = () => {
  const { getKokonsaOfTheDay } = usePost()
  const { getUserById } = useUser()
  
  const kokonsaPost = getKokonsaOfTheDay()
  
  if (!kokonsaPost) return null
  
  const author = getUserById(kokonsaPost.userId)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 opacity-10 rounded-xl" />
      
      <div className="card p-6 border-2 border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-4">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center"
          >
            <Crown className="text-white" size={20} />
          </motion.div>
          
          <div>
            <h3 className="font-bold text-lg text-gray-900 flex items-center">
              Kokonsa of the Day
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="ml-2 text-yellow-500"
              >
                ✨
              </motion.span>
            </h3>
            <p className="text-sm text-gray-600">Most engaging post today</p>
          </div>
        </div>
        
        {/* Post Content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 mb-4">
          {/* Author */}
          <div className="flex items-center space-x-3 mb-3">
            <Link to={`/profile/${author?.username}`}>
              <img
                src={author?.avatar}
                alt={author?.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-yellow-200"
              />
            </Link>
            
            <div>
              <Link 
                to={`/profile/${author?.username}`}
                className="font-semibold text-gray-900 hover:text-primary-600 transition-colors"
              >
                {author?.name}
                {author?.verified && (
                  <span className="ml-1 text-blue-500">✓</span>
                )}
              </Link>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span>@{author?.username}</span>
                <span>•</span>
                <span>{formatDistanceToNow(new Date(kokonsaPost.createdAt))}</span>
              </div>
            </div>
          </div>
          
          {/* Content */}
          <Link to={`/post/${kokonsaPost.id}`}>
            <p className="text-gray-900 leading-relaxed mb-3 hover:text-gray-700 transition-colors">
              {kokonsaPost.content.length > 150 
                ? `${kokonsaPost.content.substring(0, 150)}...` 
                : kokonsaPost.content
              }
            </p>
          </Link>
          
          {/* Images Preview */}
          {kokonsaPost.images && kokonsaPost.images.length > 0 && (
            <Link to={`/post/${kokonsaPost.id}`}>
              <div className="grid grid-cols-2 gap-2 mb-3">
                {kokonsaPost.images.slice(0, 2).map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt="Post image"
                    className="w-full h-24 object-cover rounded-lg hover:opacity-90 transition-opacity"
                  />
                ))}
                {kokonsaPost.images.length > 2 && (
                  <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                    +{kokonsaPost.images.length - 2} more
                  </div>
                )}
              </div>
            </Link>
          )}
          
          {/* Stats */}
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-1 text-red-500">
              <Heart size={16} fill="currentColor" />
              <span className="font-medium">{kokonsaPost.likes.length}</span>
            </div>
            
            <div className="flex items-center space-x-1 text-blue-500">
              <MessageCircle size={16} />
              <span className="font-medium">{kokonsaPost.comments.length}</span>
            </div>
            
            <div className="flex items-center space-x-1 text-green-500">
              <TrendingUp size={16} />
              <span className="font-medium">Trending</span>
            </div>
          </div>
        </div>
        
        {/* Action */}
        <Link 
          to={`/post/${kokonsaPost.id}`}
          className="block w-full text-center bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold py-3 rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-200 transform hover:scale-105"
        >
          View Full Post
        </Link>
      </div>
    </motion.div>
  )
}

export default KokonsaOfTheDay