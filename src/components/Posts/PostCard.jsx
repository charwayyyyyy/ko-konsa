import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Heart,
  MessageCircle,
  Share,
  Bookmark,
  MoreHorizontal,
  Edit3,
  Trash2,
  Flag,
  Copy,
  BookmarkCheck
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { usePost } from '../../contexts/PostContext'
import { useUser } from '../../contexts/UserContext'
import { formatDistanceToNow } from '../../utils/dateUtils'
import toast from 'react-hot-toast'

const PostCard = ({ post, onEdit }) => {
  const { user, loading } = useAuth()
  const { likePost, savePost, deletePost, getSavedPosts } = usePost()
  const { getUserById } = useUser()
  const [showMenu, setShowMenu] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(post.likes.length)
  const [isSaved, setIsSaved] = useState(false)
  
  useEffect(() => {
    if (user) {
      setIsLiked(post.likes.includes(user.id))
      setIsSaved(getSavedPosts().some(p => p.id === post.id))
    }
  }, [user, post.likes, post.id, getSavedPosts])
  
  const author = getUserById(post.userId)
  const isOwner = user?.id === post.userId

  const handleLike = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    try {
      await likePost(post.id)
      setIsLiked(!isLiked)
      setLikesCount(prev => isLiked ? prev - 1 : prev + 1)
      
      if (!isLiked) {
        toast.success('Post liked!')
      }
    } catch (error) {
      toast.error('Failed to like post')
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    try {
      await savePost(post.id)
      setIsSaved(!isSaved)
      toast.success(isSaved ? 'Post unsaved' : 'Post saved!')
    } catch (error) {
      toast.error('Failed to save post')
    }
  }

  const handleShare = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    try {
      await navigator.share({
        title: `${author?.name}'s post on Kokonsa`,
        text: post.content,
        url: `${window.location.origin}/post/${post.id}`
      })
    } catch (error) {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`)
      toast.success('Link copied to clipboard!')
    }
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deletePost(post.id)
        toast.success('Post deleted successfully')
      } catch (error) {
        toast.error('Failed to delete post')
      }
    }
    setShowMenu(false)
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`)
    toast.success('Link copied to clipboard!')
    setShowMenu(false)
  }

  const handleReport = () => {
    toast.success('Post reported. Thank you for helping keep Kokonsa safe.')
    setShowMenu(false)
  }

  const renderContent = (content) => {
    // Simple hashtag and mention parsing
    const parts = content.split(/(#\w+|@\w+)/g)
    
    return parts.map((part, index) => {
      if (part.startsWith('#')) {
        return (
          <span key={index} className="text-primary-600 hover:text-primary-700 cursor-pointer">
            {part}
          </span>
        )
      } else if (part.startsWith('@')) {
        return (
          <Link
            key={index}
            to={`/profile/${part.substring(1)}`}
            className="text-primary-600 hover:text-primary-700"
            onClick={(e) => e.stopPropagation()}
          >
            {part}
          </Link>
        )
      }
      return part
    })
  }

  if (loading) {
    return (
      <div className="card p-6 animate-pulse">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-gray-200"></div>
            <div>
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
              <div className="h-3 w-32 bg-gray-100 rounded mt-2"></div>
            </div>
          </div>
        </div>
        <div className="h-16 bg-gray-100 rounded mb-4"></div>
        <div className="flex justify-between">
          <div className="h-6 w-20 bg-gray-200 rounded"></div>
          <div className="h-6 w-20 bg-gray-200 rounded"></div>
          <div className="h-6 w-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -2 }}
      className="card p-6 hover:shadow-lg transition-all duration-200 relative"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Link to={`/profile/${author?.username}`}>
            <motion.img
              whileHover={{ scale: 1.05 }}
              src={author?.avatar}
              alt={author?.name}
              className="w-12 h-12 rounded-full object-cover"
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
              <span>{formatDistanceToNow(new Date(post.createdAt))}</span>
            </div>
          </div>
        </div>
        
        {/* Menu */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setShowMenu(!showMenu)
            }}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <MoreHorizontal size={20} className="text-gray-500" />
          </motion.button>
          
          <AnimatePresence>
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border z-50"
              >
                {isOwner ? (
                  <>
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        onEdit?.(post)
                        setShowMenu(false)
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                    >
                      <Edit3 size={16} className="text-blue-500" />
                      <span>Edit Post</span>
                    </button>
                    <button
                      onClick={handleDelete}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors text-red-600"
                    >
                      <Trash2 size={16} />
                      <span>Delete Post</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleCopyLink}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                    >
                      <Copy size={16} className="text-gray-500" />
                      <span>Copy Link</span>
                    </button>
                    <button
                      onClick={handleReport}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors text-red-600"
                    >
                      <Flag size={16} />
                      <span>Report Post</span>
                    </button>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Content */}
      <Link to={`/post/${post.id}`}>
        <div className="mb-4">
          <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">
            {renderContent(post.content)}
          </p>
        </div>
        
        {/* Images */}
        {post.images && post.images.length > 0 && (
          <div className="mb-4">
            {post.images.length === 1 ? (
              <motion.img
                whileHover={{ scale: 1.02 }}
                src={post.images[0]}
                alt="Post image"
                className="w-full max-h-96 object-cover rounded-lg cursor-pointer"
              />
            ) : (
              <div className={`grid gap-2 ${
                post.images.length === 2 ? 'grid-cols-2' : 
                post.images.length === 3 ? 'grid-cols-2' : 'grid-cols-2'
              }`}>
                {post.images.slice(0, 4).map((image, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    className={`relative ${
                      post.images.length === 3 && index === 0 ? 'row-span-2' : ''
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Post image ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg cursor-pointer"
                    />
                    {index === 3 && post.images.length > 4 && (
                      <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                        <span className="text-white font-semibold text-lg">
                          +{post.images.length - 4}
                        </span>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </Link>
      
      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-6">
          {/* Like */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleLike}
            className={`flex items-center space-x-2 transition-colors ${
              isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
            }`}
          >
            <motion.div
              animate={isLiked ? { scale: [1, 1.3, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              <Heart 
                size={20} 
                fill={isLiked ? 'currentColor' : 'none'}
                className={isLiked ? 'animate-heartBeat' : ''}
              />
            </motion.div>
            <span className="text-sm font-medium">{likesCount}</span>
          </motion.button>
          
          {/* Comment */}
          <Link 
            to={`/post/${post.id}`}
            className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors"
          >
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <MessageCircle size={20} />
            </motion.div>
            <span className="text-sm font-medium">{post.comments.length}</span>
          </Link>
          
          {/* Share */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleShare}
            className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors"
          >
            <Share size={20} />
          </motion.button>
        </div>
        
        {/* Save */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleSave}
          className={`transition-colors ${
            isSaved ? 'text-yellow-500' : 'text-gray-500 hover:text-yellow-500'
          }`}
        >
          {isSaved ? (
            <BookmarkCheck size={20} fill="currentColor" />
          ) : (
            <Bookmark size={20} />
          )}
        </motion.button>
      </div>
    </motion.div>
  )
}

export default PostCard