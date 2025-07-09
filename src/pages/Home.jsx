import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import CreatePost from '../components/Posts/CreatePost'
import PostCard from '../components/Posts/PostCard'
import KokonsaOfTheDay from '../components/Posts/KokonsaOfTheDay'
import LoadingSpinner from '../components/UI/LoadingSpinner'
import { usePost } from '../contexts/PostContext'
import { useAuth } from '../contexts/AuthContext'

const Home = () => {
  const { posts } = usePost()
  const { user, loading: authLoading } = useAuth()
  const [displayedPosts, setDisplayedPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const postsPerPage = 5

  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false
  })

  // Initial load
  useEffect(() => {
    if (!authLoading && posts.length > 0) {
      const initialPosts = posts.slice(0, postsPerPage)
      setDisplayedPosts(initialPosts)
      setHasMore(posts.length > postsPerPage)
    }
  }, [posts, authLoading])

  // Infinite scroll
  useEffect(() => {
    if (inView && hasMore && !loading) {
      loadMorePosts()
    }
  }, [inView, hasMore, loading])

  const loadMorePosts = async () => {
    setLoading(true)
    
    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const startIndex = page * postsPerPage
    const endIndex = startIndex + postsPerPage
    const newPosts = posts.slice(startIndex, endIndex)
    
    if (newPosts.length === 0) {
      setHasMore(false)
    } else {
      setDisplayedPosts(prev => [...prev, ...newPosts])
      setPage(prev => prev + 1)
    }
    
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      {!authLoading && user && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6 bg-gradient-to-r from-primary-50 to-accent-50 border-primary-200"
        >
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back, {user.name}! 👋
          </h1>
          <p className="text-gray-600">
            Discover what's happening in your network and share your thoughts with the world.
          </p>
        </motion.div>
      )}

      {/* Create Post */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <CreatePost />
      </motion.div>

      {/* Kokonsa of the Day */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <KokonsaOfTheDay />
      </motion.div>

      {/* Posts Feed */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Latest Posts</h2>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Live Feed</span>
          </div>
        </div>

        {displayedPosts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="card p-12 text-center"
          >
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📝</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
            <p className="text-gray-600 mb-4">
              Be the first to share something amazing with the community!
            </p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {displayedPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <PostCard post={post} />
              </motion.div>
            ))}
          </div>
        )}

        {/* Load More Trigger */}
        {hasMore && (
          <div ref={loadMoreRef} className="flex justify-center py-8">
            {loading && <LoadingSpinner />}
          </div>
        )}

        {/* End of Feed */}
        {!hasMore && displayedPosts.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8"
          >
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-xl">🎉</span>
            </div>
            <p className="text-gray-600 font-medium">You're all caught up!</p>
            <p className="text-sm text-gray-500 mt-1">
              You've seen all the latest posts. Check back later for more content.
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* Floating Action Button for Mobile */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-full shadow-lg flex items-center justify-center lg:hidden z-40"
        onClick={() => {
          document.querySelector('[data-create-post]')?.scrollIntoView({ 
            behavior: 'smooth' 
          })
        }}
      >
        <span className="text-2xl">+</span>
      </motion.button>
    </div>
  )
}

export default Home