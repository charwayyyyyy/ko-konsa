import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  User, 
  Edit, 
  Calendar, 
  MapPin, 
  Link as LinkIcon, 
  Grid3X3, 
  Heart, 
  Bookmark,
  Settings,
  X,
  Camera,
  Check
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { usePost } from '../contexts/PostContext'
import { useUser } from '../contexts/UserContext'
import PostCard from '../components/Posts/PostCard'
import LoadingSpinner from '../components/UI/LoadingSpinner'
import toast from 'react-hot-toast'

const Profile = () => {
  const { username } = useParams()
  const { user, updateProfile } = useAuth()
  const { getUserByUsername, followUser, isFollowing, getFollowersCount, getFollowingCount } = useUser()
  const { getPostsByUser, getLikedPosts } = usePost()
  
  const [profileUser, setProfileUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('posts')
  const [isEditing, setIsEditing] = useState(false)
  const [editFormData, setEditFormData] = useState({
    name: '',
    bio: '',
    location: '',
    website: '',
    avatar: ''
  })
  const [previewAvatar, setPreviewAvatar] = useState('')
  const [savingProfile, setSavingProfile] = useState(false)
  
  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true)
      try {
        const userData = getUserByUsername(username)
        if (userData) {
          setProfileUser(userData)
          // Initialize edit form data if it's the current user
          if (userData.id === user?.id) {
            setEditFormData({
              name: userData.name || '',
              bio: userData.bio || '',
              location: userData.location || '',
              website: userData.website || '',
              avatar: userData.avatar || ''
            })
            setPreviewAvatar(userData.avatar || '')
          }
        }
      } catch (error) {
        toast.error('Failed to load profile')
      } finally {
        setLoading(false)
      }
    }
    
    fetchUserData()
  }, [username, getUserByUsername, user])
  
  // Get user posts based on active tab
  const getUserContent = () => {
    if (!profileUser) return []
    
    switch (activeTab) {
      case 'posts':
        return getPostsByUser(profileUser.id)
      case 'likes':
        return getLikedPosts(profileUser.id)
      case 'media':
        return getPostsByUser(profileUser.id).filter(post => post.images && post.images.length > 0)
      case 'saved':
        // Only show saved posts for the current user
        return profileUser.id === user?.id ? getPostsByUser(profileUser.id).filter(post => post.saved) : []
      default:
        return []
    }
  }
  
  const userContent = getUserContent()
  const isCurrentUser = profileUser?.id === user?.id
  const isFollowingUser = profileUser ? isFollowing(profileUser.id) : false
  
  const handleFollow = () => {
    if (profileUser) {
      followUser(profileUser.id)
      // Update the profile user to reflect the new following state
      setProfileUser(prevUser => ({
        ...prevUser,
        followers: isFollowingUser
          ? prevUser.followers.filter(id => id !== user?.id)
          : [...prevUser.followers, user?.id]
      }))
    }
  }
  
  const handleEditProfile = () => {
    setIsEditing(true)
  }
  
  const handleCancelEdit = () => {
    setIsEditing(false)
    // Reset form data
    if (profileUser) {
      setEditFormData({
        name: profileUser.name || '',
        bio: profileUser.bio || '',
        location: profileUser.location || '',
        website: profileUser.website || '',
        avatar: profileUser.avatar || ''
      })
      setPreviewAvatar(profileUser.avatar || '')
    }
  }
  
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // For demo purposes, we'll just use a fake URL
      // In a real app, you would upload the file to a server
      const fakeUrl = URL.createObjectURL(file)
      setPreviewAvatar(fakeUrl)
      setEditFormData(prev => ({
        ...prev,
        avatar: fakeUrl
      }))
    }
  }
  
  const handleSaveProfile = async () => {
    if (!editFormData.name.trim()) {
      toast.error('Name is required')
      return
    }
    
    setSavingProfile(true)
    try {
      await updateProfile({
        ...editFormData,
        id: profileUser.id,
        username: profileUser.username,
        email: profileUser.email
      })
      
      // Update the profile user state
      setProfileUser(prev => ({
        ...prev,
        name: editFormData.name,
        bio: editFormData.bio,
        location: editFormData.location,
        website: editFormData.website,
        avatar: editFormData.avatar
      }))
      
      setIsEditing(false)
      toast.success('Profile updated successfully')
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setSavingProfile(false)
    }
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    )
  }
  
  if (!profileUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">User not found</h1>
        <p className="text-gray-600 mb-4">The user you're looking for doesn't exist.</p>
        <Link to="/" className="btn-primary">
          Go Home
        </Link>
      </div>
    )
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="card overflow-hidden mb-6">
        {/* Cover Photo */}
        <div className="h-48 bg-gradient-to-r from-primary-400 to-accent-400 relative">
          {isCurrentUser && isEditing && (
            <button className="absolute top-4 right-4 p-2 bg-black/30 text-white rounded-full hover:bg-black/50 transition-colors">
              <Camera size={20} />
            </button>
          )}
        </div>
        
        {/* Profile Info */}
        <div className="px-6 pb-6">
          <div className="flex flex-col md:flex-row md:items-end -mt-16 mb-6">
            {/* Avatar */}
            <div className="relative">
              {isEditing ? (
                <div className="relative">
                  <img
                    src={previewAvatar}
                    alt={profileUser.name}
                    className="w-32 h-32 rounded-full object-cover border-4 border-white"
                  />
                  <label className="absolute bottom-0 right-0 p-2 bg-primary-500 text-white rounded-full cursor-pointer hover:bg-primary-600 transition-colors">
                    <Camera size={16} />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                  </label>
                </div>
              ) : (
                <img
                  src={profileUser.avatar}
                  alt={profileUser.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-white"
                />
              )}
            </div>
            
            <div className="flex-1 mt-4 md:mt-0 md:ml-6">
              {isEditing ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    name="name"
                    value={editFormData.name}
                    onChange={handleInputChange}
                    placeholder="Your name"
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <textarea
                    name="bio"
                    value={editFormData.bio}
                    onChange={handleInputChange}
                    placeholder="Write a bio"
                    rows={3}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  />
                </div>
              ) : (
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                    {profileUser.name}
                    {profileUser.verified && (
                      <span className="ml-2 text-blue-500 text-sm bg-blue-100 px-2 py-0.5 rounded-full">Verified</span>
                    )}
                  </h1>
                  <p className="text-gray-600 mb-2">@{profileUser.username}</p>
                  {profileUser.bio && (
                    <p className="text-gray-800 mb-4">{profileUser.bio}</p>
                  )}
                </div>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="mt-4 md:mt-0 flex space-x-3">
              {isEditing ? (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSaveProfile}
                    disabled={savingProfile}
                    className="btn-primary flex items-center space-x-2"
                  >
                    {savingProfile ? (
                      <div className="spinner-sm" />
                    ) : (
                      <>
                        <Check size={16} />
                        <span>Save</span>
                      </>
                    )}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCancelEdit}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <X size={16} />
                    <span>Cancel</span>
                  </motion.button>
                </>
              ) : isCurrentUser ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleEditProfile}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <Edit size={16} />
                  <span>Edit Profile</span>
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleFollow}
                  className={`flex items-center space-x-2 ${isFollowingUser ? 'btn-secondary' : 'btn-primary'}`}
                >
                  <span>{isFollowingUser ? 'Following' : 'Follow'}</span>
                </motion.button>
              )}
            </div>
          </div>
          
          {/* Additional Profile Info */}
          {isEditing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="relative">
                <MapPin size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="location"
                  value={editFormData.location}
                  onChange={handleInputChange}
                  placeholder="Location"
                  className="w-full pl-10 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div className="relative">
                <LinkIcon size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="website"
                  value={editFormData.website}
                  onChange={handleInputChange}
                  placeholder="Website"
                  className="w-full pl-10 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap items-center text-sm text-gray-600 space-x-6">
              <div className="flex items-center space-x-2 mb-2">
                <Calendar size={16} />
                <span>Joined January 2024</span>
              </div>
              
              {profileUser.location && (
                <div className="flex items-center space-x-2 mb-2">
                  <MapPin size={16} />
                  <span>{profileUser.location}</span>
                </div>
              )}
              
              {profileUser.website && (
                <div className="flex items-center space-x-2 mb-2">
                  <LinkIcon size={16} />
                  <a 
                    href={profileUser.website.startsWith('http') ? profileUser.website : `https://${profileUser.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:underline"
                  >
                    {profileUser.website.replace(/^https?:\/\//i, '')}
                  </a>
                </div>
              )}
            </div>
          )}
          
          {/* Stats */}
          <div className="flex space-x-6 mt-6">
            <div className="text-center">
              <span className="block font-bold text-gray-900">{getPostsByUser(profileUser.id).length}</span>
              <span className="text-sm text-gray-600">Posts</span>
            </div>
            <div className="text-center">
              <span className="block font-bold text-gray-900">{getFollowersCount(profileUser.id)}</span>
              <span className="text-sm text-gray-600">Followers</span>
            </div>
            <div className="text-center">
              <span className="block font-bold text-gray-900">{getFollowingCount(profileUser.id)}</span>
              <span className="text-sm text-gray-600">Following</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content Tabs */}
      <div className="card mb-6">
        <div className="flex overflow-x-auto scrollbar-hide">
          {[
            { id: 'posts', label: 'Posts', icon: Grid3X3 },
            { id: 'likes', label: 'Likes', icon: Heart },
            { id: 'media', label: 'Media', icon: Camera },
            ...(isCurrentUser ? [{ id: 'saved', label: 'Saved', icon: Bookmark }] : [])
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-[100px] flex flex-col items-center py-4 px-2 border-b-2 transition-colors ${activeTab === tab.id ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              >
                <Icon size={20} className="mb-1" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>
      
      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          {userContent.length === 0 ? (
            <div className="card p-12 text-center">
              <div className="text-gray-400 mb-4">
                {activeTab === 'posts' && <Grid3X3 size={48} className="mx-auto" />}
                {activeTab === 'likes' && <Heart size={48} className="mx-auto" />}
                {activeTab === 'media' && <Camera size={48} className="mx-auto" />}
                {activeTab === 'saved' && <Bookmark size={48} className="mx-auto" />}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No {activeTab} yet
              </h3>
              <p className="text-gray-600">
                {activeTab === 'posts' && "When you create posts, they'll appear here."}
                {activeTab === 'likes' && "Posts you like will appear here."}
                {activeTab === 'media' && "Posts with media will appear here."}
                {activeTab === 'saved' && "Posts you save will appear here."}
              </p>
              
              {isCurrentUser && activeTab === 'posts' && (
                <Link to="/" className="btn-primary inline-block mt-4">
                  Create a Post
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {userContent.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <PostCard post={post} />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default Profile