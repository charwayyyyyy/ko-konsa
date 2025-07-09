import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Heart, MessageCircle, Share, Bookmark } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { usePost } from '../contexts/PostContext'
import { useUser } from '../contexts/UserContext'
import PostCard from '../components/Posts/PostCard'
import LoadingSpinner from '../components/UI/LoadingSpinner'
import { formatDate } from '../utils/dateUtils'
import toast from 'react-hot-toast'

const PostDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { getPostById, addComment, likeComment, getRelatedPosts } = usePost()
  const { getUserById } = useUser()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  
  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true)
      try {
        const postData = getPostById(id)
        setPost(postData)
      } catch (error) {
        toast.error('Failed to load post')
      } finally {
        setLoading(false)
      }
    }
    
    fetchPost()
  }, [id, getPostById])
  
  const handleAddComment = async (e) => {
    e.preventDefault()
    if (!comment.trim()) return
    
    setSubmitting(true)
    try {
      await addComment(id, comment.trim())
      setComment('')
      // Refresh post data
      const updatedPost = getPostById(id)
      setPost(updatedPost)
      toast.success('Comment added!')
    } catch (error) {
      toast.error('Failed to add comment')
    } finally {
      setSubmitting(false)
    }
  }
  
  const handleLikeComment = async (commentId) => {
    try {
      await likeComment(id, commentId)
      // Refresh post data
      const updatedPost = getPostById(id)
      setPost(updatedPost)
    } catch (error) {
      toast.error('Failed to like comment')
    }
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    )
  }
  
  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Post not found</h1>
        <p className="text-gray-600 mb-4">The post you're looking for doesn't exist.</p>
        <button onClick={() => navigate(-1)} className="btn-primary">
          Go Back
        </button>
      </div>
    )
  }
  
  const author = getUserById(post.userId)
  const relatedPosts = getRelatedPosts(post.id, 3)
  
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft size={20} />
        </motion.button>
        <h1 className="text-xl font-semibold text-gray-900">Post</h1>
      </div>
      
      {/* Main Post */}
      <div className="card p-6 mb-6">
        <PostCard post={post} />
      </div>
      
      {/* Comments Section */}
      <div className="card p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Comments ({post.comments.length})
        </h2>
        
        {/* Add Comment */}
        {user && (
          <form onSubmit={handleAddComment} className="mb-6">
            <div className="flex space-x-3">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  rows={3}
                />
                <div className="flex justify-end mt-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={!comment.trim() || submitting}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Posting...' : 'Post Comment'}
                  </motion.button>
                </div>
              </div>
            </div>
          </form>
        )}
        
        {/* Comments List */}
        <div className="space-y-4">
          {post.comments.map((comment) => {
            const commentAuthor = getUserById(comment.userId)
            return (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex space-x-3 p-4 bg-gray-50 rounded-lg"
              >
                <Link to={`/profile/${commentAuthor?.username}`}>
                  <img
                    src={commentAuthor?.avatar}
                    alt={commentAuthor?.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </Link>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <Link
                      to={`/profile/${commentAuthor?.username}`}
                      className="font-semibold text-gray-900 hover:text-primary-600"
                    >
                      {commentAuthor?.name}
                    </Link>
                    <span className="text-gray-500">@{commentAuthor?.username}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-500 text-sm">
                      {formatDate(new Date(comment.createdAt))}
                    </span>
                  </div>
                  
                  <p className="text-gray-900 mb-2">{comment.content}</p>
                  
                  <div className="flex items-center space-x-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleLikeComment(comment.id)}
                      className={`flex items-center space-x-1 text-sm transition-colors ${
                        comment.likes.includes(user?.id)
                          ? 'text-red-500'
                          : 'text-gray-500 hover:text-red-500'
                      }`}
                    >
                      <Heart
                        size={16}
                        fill={comment.likes.includes(user?.id) ? 'currentColor' : 'none'}
                      />
                      <span>{comment.likes.length}</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
      
      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Related Posts
          </h2>
          
          <div className="space-y-4">
            {relatedPosts.map((relatedPost) => (
              <motion.div
                key={relatedPost.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <PostCard post={relatedPost} />
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default PostDetail