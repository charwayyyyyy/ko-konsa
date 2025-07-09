import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Home, 
  Search, 
  Bell, 
  Mail, 
  Bookmark, 
  User, 
  TrendingUp,
  Users,
  Settings
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useUser } from '../../contexts/UserContext'

const Sidebar = () => {
  const { user, loading } = useAuth()
  const { getFollowersCount, getFollowingCount } = useUser()
  const [menuItems, setMenuItems] = useState([])

  useEffect(() => {
    if (user) {
      setMenuItems([
        { icon: Home, label: 'Home', path: '/', color: 'text-blue-600' },
        { icon: Search, label: 'Explore', path: '/search', color: 'text-green-600' },
        { icon: Bell, label: 'Notifications', path: '/notifications', color: 'text-yellow-600' },
        { icon: Mail, label: 'Messages', path: '/messages', color: 'text-purple-600' },
        { icon: Bookmark, label: 'Saved Posts', path: '/saved', color: 'text-red-600' },
        { icon: User, label: 'Profile', path: `/profile/${user.username}`, color: 'text-indigo-600' },
        { icon: TrendingUp, label: 'Trending', path: '/trending', color: 'text-orange-600' },
        { icon: Users, label: 'Communities', path: '/communities', color: 'text-teal-600' },
        { icon: Settings, label: 'Settings', path: '/settings', color: 'text-gray-600' },
      ])
    }
  }, [user])

  return (
    <div className="space-y-6">
      {/* User Profile Card */}
      {!loading && user && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6"
        >
          <Link to={`/profile/${user.username}`} className="block">
            <div className="flex items-center space-x-3 mb-4">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-primary-100"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{user.name}</h3>
                <p className="text-sm text-gray-500 truncate">@{user.username}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-lg font-bold text-gray-900">{getFollowersCount(user.id)}</p>
                <p className="text-xs text-gray-500">Followers</p>
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">{getFollowingCount(user.id)}</p>
                <p className="text-xs text-gray-500">Following</p>
              </div>
            </div>
          </Link>
        </motion.div>
      )}

      {/* Navigation Menu */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card p-4"
      >
        <h3 className="font-semibold text-gray-900 mb-4">Menu</h3>
        <nav className="space-y-1">
          {!loading && user && menuItems.map((item, index) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  to={item.path}
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 group"
                >
                  <Icon 
                    size={20} 
                    className={`${item.color} group-hover:scale-110 transition-transform duration-200`}
                  />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </motion.div>
            )
          })}
        </nav>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card p-4"
      >
        <h3 className="font-semibold text-gray-900 mb-4">Your Activity</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Posts this week</span>
            <span className="font-semibold text-primary-600">12</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Likes received</span>
            <span className="font-semibold text-accent-600">89</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Comments made</span>
            <span className="font-semibold text-green-600">34</span>
          </div>
        </div>
      </motion.div>

      {/* Trending Topics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card p-4"
      >
        <h3 className="font-semibold text-gray-900 mb-4">Trending</h3>
        <div className="space-y-2">
          {['#ReactJS', '#WebDev', '#Design', '#Photography', '#Fitness'].map((tag, index) => (
            <motion.div
              key={tag}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.05 }}
              className="flex items-center justify-between py-1"
            >
              <span className="text-sm font-medium text-primary-600 hover:text-primary-700 cursor-pointer">
                {tag}
              </span>
              <span className="text-xs text-gray-500">{Math.floor(Math.random() * 100)}K</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default Sidebar