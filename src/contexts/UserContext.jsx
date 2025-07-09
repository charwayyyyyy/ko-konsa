import React, { createContext, useContext, useState } from 'react'
import { useAuth } from './AuthContext'
import toast from 'react-hot-toast'

const UserContext = createContext()

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

export const UserProvider = ({ children }) => {
  const { user, updateProfile, sampleUsers } = useAuth()
  const [users, setUsers] = useState(sampleUsers)

  const followUser = (targetUserId) => {
    if (!user) return
    
    const isFollowing = user.following.includes(targetUserId)
    
    if (isFollowing) {
      // Unfollow
      const updatedFollowing = user.following.filter(id => id !== targetUserId)
      updateProfile({ following: updatedFollowing })
      
      // Update target user's followers
      const targetUser = users.find(u => u.id === targetUserId)
      if (targetUser) {
        const updatedFollowers = targetUser.followers.filter(id => id !== user.id)
        const updatedUsers = users.map(u => 
          u.id === targetUserId 
            ? { ...u, followers: updatedFollowers }
            : u
        )
        setUsers(updatedUsers)
      }
      
      toast.success('Unfollowed successfully')
    } else {
      // Follow
      const updatedFollowing = [...user.following, targetUserId]
      updateProfile({ following: updatedFollowing })
      
      // Update target user's followers
      const targetUser = users.find(u => u.id === targetUserId)
      if (targetUser) {
        const updatedFollowers = [...targetUser.followers, user.id]
        const updatedUsers = users.map(u => 
          u.id === targetUserId 
            ? { ...u, followers: updatedFollowers }
            : u
        )
        setUsers(updatedUsers)
      }
      
      toast.success('Following successfully')
    }
  }

  const getUserById = (userId) => {
    return users.find(u => u.id === userId)
  }

  const getUserByUsername = (username) => {
    return users.find(u => u.username === username)
  }

  const isFollowing = (targetUserId) => {
    if (!user) return false
    return user.following.includes(targetUserId)
  }

  const getFollowersCount = (userId) => {
    const targetUser = users.find(u => u.id === userId)
    return targetUser ? targetUser.followers.length : 0
  }

  const getFollowingCount = (userId) => {
    const targetUser = users.find(u => u.id === userId)
    return targetUser ? targetUser.following.length : 0
  }

  const searchUsers = (query) => {
    if (!query.trim()) return []
    
    const lowercaseQuery = query.toLowerCase()
    return users.filter(u => 
      u.username.toLowerCase().includes(lowercaseQuery) ||
      u.name.toLowerCase().includes(lowercaseQuery) ||
      u.bio.toLowerCase().includes(lowercaseQuery)
    )
  }

  const value = {
    users,
    followUser,
    getUserById,
    getUserByUsername,
    isFollowing,
    getFollowersCount,
    getFollowingCount,
    searchUsers
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}