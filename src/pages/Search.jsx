import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search as SearchIcon, User, Hash, TrendingUp, X } from 'lucide-react'
import { useUser } from '../contexts/UserContext'
import { usePost } from '../contexts/PostContext'
import PostCard from '../components/Posts/PostCard'
import { Link } from 'react-router-dom'

const Search = () => {
  const [query, setQuery] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [results, setResults] = useState({ users: [], posts: [] })
  const [loading, setLoading] = useState(false)
  const [recentSearches, setRecentSearches] = useState([])
  const { searchUsers } = useUser()
  const { searchPosts } = usePost()
  
  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem('recentSearches')
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])
  
  useEffect(() => {
    const performSearch = async () => {
      if (!query.trim()) {
        setResults({ users: [], posts: [] })
        return
      }
      
      setLoading(true)
      try {
        const [users, posts] = await Promise.all([
          searchUsers(query),
          searchPosts(query)
        ])
        
        setResults({ users, posts })
        
        // Add to recent searches
        const newRecentSearches = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5)
        setRecentSearches(newRecentSearches)
        localStorage.setItem('recentSearches', JSON.stringify(newRecentSearches))
      } catch (error) {
        console.error('Search failed:', error)
      } finally {
        setLoading(false)
      }
    }
    
    const debounceTimer = setTimeout(performSearch, 300)
    return () => clearTimeout(debounceTimer)
  }, [query, searchUsers, searchPosts, recentSearches])
  
  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem('recentSearches')
  }
  
  const removeRecentSearch = (searchTerm) => {
    const updated = recentSearches.filter(s => s !== searchTerm)
    setRecentSearches(updated)
    localStorage.setItem('recentSearches', JSON.stringify(updated))
  }
  
  const trendingTopics = [
    { tag: '#kokonsa', posts: 1234 },
    { tag: '#socialmedia', posts: 856 },
    { tag: '#trending', posts: 642 },
    { tag: '#viral', posts: 523 },
    { tag: '#community', posts: 445 }
  ]
  
  const getFilteredResults = () => {
    switch (activeTab) {
      case 'users':
        return { users: results.users, posts: [] }
      case 'posts':
        return { users: [], posts: results.posts }
      default:
        return results
    }
  }
  
  const filteredResults = getFilteredResults()
  const totalResults = filteredResults.users.length + filteredResults.posts.length
  
  return (
    <div className="max-w-4xl mx-auto">
      {/* Search Header */}
      <div className="card p-6 mb-6">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for people, posts, or topics..."
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
          />
          {query && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </motion.button>
          )}
        </div>
        
        {/* Search Tabs */}
        {query && (
          <div className="flex space-x-6 mt-4 border-b border-gray-200">
            {[
              { id: 'all', label: 'All', count: totalResults },
              { id: 'users', label: 'People', count: results.users.length },
              { id: 'posts', label: 'Posts', count: results.posts.length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* Search Results */}
      {query ? (
        <div>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            </div>
          ) : totalResults === 0 ? (
            <div className="text-center py-12">
              <SearchIcon className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No results found
              </h3>
              <p className="text-gray-600">
                Try searching for something else or check your spelling.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Users Results */}
              {filteredResults.users.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <User className="mr-2" size={20} />
                    People ({filteredResults.users.length})
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <AnimatePresence>
                      {filteredResults.users.map((user) => (
                        <motion.div
                          key={user.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="card p-4 hover:shadow-md transition-shadow"
                        >
                          <Link to={`/profile/${user.username}`} className="flex items-center space-x-3">
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 hover:text-primary-600 transition-colors">
                                {user.name}
                                {user.verified && (
                                  <span className="ml-1 text-blue-500">✓</span>
                                )}
                              </h3>
                              <p className="text-gray-600">@{user.username}</p>
                              {user.bio && (
                                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                  {user.bio}
                                </p>
                              )}
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              )}
              
              {/* Posts Results */}
              {filteredResults.posts.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Hash className="mr-2" size={20} />
                    Posts ({filteredResults.posts.length})
                  </h2>
                  
                  <div className="space-y-4">
                    <AnimatePresence>
                      {filteredResults.posts.map((post) => (
                        <motion.div
                          key={post.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                        >
                          <PostCard post={post} />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Recent Searches</h2>
                <button
                  onClick={clearRecentSearches}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  Clear all
                </button>
              </div>
              
              <div className="space-y-2">
                {recentSearches.map((search, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <button
                      onClick={() => setQuery(search)}
                      className="flex items-center space-x-3 flex-1 text-left"
                    >
                      <SearchIcon size={16} className="text-gray-400" />
                      <span className="text-gray-900">{search}</span>
                    </button>
                    
                    <button
                      onClick={() => removeRecentSearch(search)}
                      className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                    >
                      <X size={14} className="text-gray-400" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
          
          {/* Trending Topics */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="mr-2" size={20} />
              Trending Topics
            </h2>
            
            <div className="space-y-3">
              {trendingTopics.map((topic, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setQuery(topic.tag)}
                  className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-gray-900">{topic.tag}</div>
                      <div className="text-sm text-gray-500">{topic.posts.toLocaleString()} posts</div>
                    </div>
                    <TrendingUp size={16} className="text-green-500" />
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Search