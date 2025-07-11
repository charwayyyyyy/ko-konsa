import React, { createContext, useContext, useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Sample users for demo purposes
const SAMPLE_USERS = [
  {
    id: '1',
    username: 'john_doe',
    email: 'john@example.com',
    password: 'password123',
    name: 'John Doe',
    bio: 'Software developer',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    followers: ['2', '3', '4'],
    following: ['2', '3'],
    verified: true
  },
  {
    id: '2',
    username: 'jane_smith',
    email: 'jane@example.com',
    password: 'password123',
    name: 'Jane Smith',
    bio: 'Digital artist & UI/UX designer 🎨',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    followers: ['1', '3', '4', '5'],
    following: ['1', '4'],
    verified: true
  },
  {
    id: '3',
    username: 'alex_wilson',
    email: 'alex@example.com',
    password: 'password123',
    name: 'Alex Wilson',
    bio: 'Travel photographer 📸',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    followers: ['1', '2', '4'],
    following: ['1', '2', '5'],
    verified: false
  },
  {
    id: '4',
    username: 'sarah_jones',
    email: 'sarah@example.com',
    password: 'password123',
    name: 'Sarah Jones',
    bio: 'Food blogger & chef 👩‍🍳 | Sharing delicious recipes',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    followers: ['1', '2', '3', '5'],
    following: ['2', '3'],
    verified: true
  },
  {
    id: '5',
    username: 'mike_brown',
    email: 'mike@example.com',
    password: 'password123',
    name: 'Mike Brown',
    bio: 'Fitness trainer 💪 | Helping you achieve your goals',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    followers: ['3', '4'],
    following: ['1', '2', '3', '4'],
    verified: false
  }
]

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if user is logged in from localStorage
        const savedUser = localStorage.getItem('kokonsa_user')
        
        if (savedUser) {
          try {
            const parsedUser = JSON.parse(savedUser)
            setUser(parsedUser)
            
            // Validate user data
            if (!parsedUser.id || !parsedUser.username) {
              console.error('Invalid user data in localStorage')
              localStorage.removeItem('kokonsa_user')
              setUser(null)
            }
          } catch (error) {
            console.error('Error parsing user data:', error)
            localStorage.removeItem('kokonsa_user')
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
      } finally {
        // Add a small delay to ensure smooth loading transition
        setTimeout(() => setLoading(false), 300)
      }
    }
    
    initializeAuth()
    
    // Set up storage event listener to sync auth state across tabs
    const handleStorageChange = (e) => {
      if (e.key === 'kokonsa_user') {
        if (e.newValue) {
          setUser(JSON.parse(e.newValue))
        } else {
          setUser(null)
        }
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const login = async (email, password) => {
    try {
      setLoading(true)
      
      // Validate inputs
      if (!email || !password) {
        throw new Error('Email and password are required')
      }
      
      // Simulate network delay for realistic behavior
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Find user by email and password
      const foundUser = SAMPLE_USERS.find(
        u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      )
      
      if (!foundUser) {
        throw new Error('Invalid email or password')
      }
      
      // Remove password from user object
      const { password: _, ...userWithoutPassword } = foundUser
      
      // Set session data
      const sessionData = {
        ...userWithoutPassword,
        lastLogin: new Date().toISOString(),
        sessionId: Math.random().toString(36).substring(2)
      }
      
      setUser(sessionData)
      
      try {
        localStorage.setItem('kokonsa_user', JSON.stringify(sessionData))
      } catch (storageError) {
        console.error('Failed to save to localStorage:', storageError)
      }
      
      toast.success(`Welcome back, ${foundUser.name}!`)
      return sessionData
    } catch (error) {
      toast.error(error.message || 'Login failed. Please try again.')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signup = async (userData) => {
    try {
      setLoading(true)
      
      // Check if email or username already exists
      const emailExists = SAMPLE_USERS.find(u => u.email === userData.email)
      const usernameExists = SAMPLE_USERS.find(u => u.username === userData.username)
      
      if (emailExists) {
        throw new Error('Email already exists')
      }
      
      if (usernameExists) {
        throw new Error('Username already taken')
      }
      
      // Create new user
      const newUser = {
        id: Date.now().toString(),
        ...userData,
        bio: '',
        avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face`,
        followers: [],
        following: [],
        verified: false
      }
      
      // Remove password from user object
      const { password: _, ...userWithoutPassword } = newUser
      
      // Add to sample users (in real app, this would be saved to database)
      SAMPLE_USERS.push(newUser)
      
      setUser(userWithoutPassword)
      localStorage.setItem('kokonsa_user', JSON.stringify(userWithoutPassword))
      
      toast.success('Account created successfully!')
      return userWithoutPassword
    } catch (error) {
      toast.error(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    try {
      // Clear all app data
      setUser(null)
      localStorage.removeItem('kokonsa_user')
      
      // Clear any other app-specific data
      const appKeys = Object.keys(localStorage).filter(key => key.startsWith('kokonsa_'))
      appKeys.forEach(key => localStorage.removeItem(key))
      
      // Clear session storage
      sessionStorage.clear()
      
      toast.success('Logged out successfully')
    } catch (error) {
      console.error('Error during logout:', error)
      toast.error('There was a problem logging out')
    }
  }

  const updateProfile = (updatedData) => {
    const updatedUser = { ...user, ...updatedData }
    setUser(updatedUser)
    localStorage.setItem('kokonsa_user', JSON.stringify(updatedUser))
    
    // Update in SAMPLE_USERS array
    const userIndex = SAMPLE_USERS.findIndex(u => u.id === user.id)
    if (userIndex !== -1) {
      SAMPLE_USERS[userIndex] = { ...SAMPLE_USERS[userIndex], ...updatedData }
    }
    
    toast.success('Profile updated successfully!')
  }

  const value = {
    user,
    login,
    signup,
    logout,
    updateProfile,
    loading,
    sampleUsers: SAMPLE_USERS
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}