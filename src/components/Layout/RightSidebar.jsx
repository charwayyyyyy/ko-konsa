import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { UserPlus, TrendingUp, Calendar, MapPin } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useUser } from '../../contexts/UserContext'

const RightSidebar = () => {
  const { user, loading } = useAuth()
  const { users, followUser, isFollowing } = useUser()
  const [suggestedUsers, setSuggestedUsers] = useState([])

  // Get suggested users (users not followed by current user)
  useEffect(() => {
    if (user) {
      const suggested = users
        .filter(u => u.id !== user.id && !isFollowing(u.id))
        .slice(0, 3)
      setSuggestedUsers(suggested)
    }
  }, [user, users, isFollowing])

  const trendingTopics = [
    { tag: '#ReactJS', posts: '12.5K', trend: '+15%' },
    { tag: '#WebDevelopment', posts: '8.9K', trend: '+8%' },
    { tag: '#UIDesign', posts: '6.2K', trend: '+12%' },
    { tag: '#Photography', posts: '4.8K', trend: '+5%' },
    { tag: '#Anime', posts: '3.1K', trend: '+20%' },
  ]

  const upcomingEvents = [
    {
      title: 'React Conference 2025',
      date: 'July 15, 2024',
      location: 'Accra, Ghana',
      attendees: 1200
    },
    {
      title: 'Design Systems Meetup',
      date: 'Septeber 20, 2025',
      location: 'New York, NY',
      attendees: 350
    },
    {
      title: 'Photography Workshop',
      date: 'August 25, 2025',
      location: 'Los Angeles, CA',
      attendees: 80
    }
  ]

  return (
    <div className="space-y-6">
      {/* Who to Follow */}
      {!loading && user && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6"
        >
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
            <UserPlus size={20} className="mr-2 text-primary-600" />
            Who to Follow
          </h3>
          <div className="space-y-4">
            {suggestedUsers.map((suggestedUser, index) => (
              <motion.div
                key={suggestedUser.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between"
              >
                <Link 
                  to={`/profile/${suggestedUser.username}`}
                  className="flex items-center space-x-3 flex-1 min-w-0"
                >
                  <img
                    src={suggestedUser.avatar}
                    alt={suggestedUser.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {suggestedUser.name}
                      {suggestedUser.verified && (
                        <span className="ml-1 text-blue-500">✓</span>
                      )}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      @{suggestedUser.username}
                    </p>
                  </div>
                </Link>
                <button
                  onClick={() => followUser(suggestedUser.id)}
                  className="btn-primary text-sm px-3 py-1"
                >
                  Follow
                </button>
              </motion.div>
            ))}
          </div>
          <Link 
            to="/explore/people" 
            className="block text-center text-primary-600 hover:text-primary-700 font-medium mt-4 text-sm"
          >
            Show more
          </Link>
        </motion.div>
      )}

      {/* Trending Topics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card p-6"
      >
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
          <TrendingUp size={20} className="mr-2 text-accent-600" />
          Trending Topics
        </h3>
        <div className="space-y-3">
          {trendingTopics.map((topic, index) => (
            <motion.div
              key={topic.tag}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className="flex items-center justify-between py-2 hover:bg-gray-50 rounded-lg px-2 -mx-2 cursor-pointer transition-colors"
            >
              <div>
                <p className="font-medium text-primary-600">{topic.tag}</p>
                <p className="text-sm text-gray-500">{topic.posts} posts</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-green-600">{topic.trend}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Upcoming Events */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card p-6"
      >
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
          <Calendar size={20} className="mr-2 text-purple-600" />
          Upcoming Events
        </h3>
        <div className="space-y-4">
          {upcomingEvents.map((event, index) => (
            <motion.div
              key={event.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="border-l-4 border-purple-200 pl-4 py-2 hover:border-purple-400 transition-colors cursor-pointer"
            >
              <h4 className="font-medium text-gray-900 text-sm">{event.title}</h4>
              <div className="flex items-center text-xs text-gray-500 mt-1">
                <Calendar size={12} className="mr-1" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center text-xs text-gray-500 mt-1">
                <MapPin size={12} className="mr-1" />
                <span>{event.location}</span>
              </div>
              <p className="text-xs text-purple-600 mt-1">
                {event.attendees} attending
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card p-6"
      >
        <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="space-y-2">
          <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
            📝 Create a post
          </button>
          <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
            📸 Share a photo
          </button>
          <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
            🎥 Go live
          </button>
          <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
            📊 Create a poll
          </button>
        </div>
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-center text-xs text-gray-500 space-y-1"
      >
        <p>© 2024 Kokonsa. All rights reserved.</p>
        <div className="flex justify-center space-x-4">
          <a href="#" className="hover:text-gray-700">Privacy</a>
          <a href="#" className="hover:text-gray-700">Terms</a>
          <a href="#" className="hover:text-gray-700">Help</a>
        </div>
      </motion.div>
    </div>
  )
}

export default RightSidebar