import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import toast from 'react-hot-toast'

const PostContext = createContext()

export const usePost = () => {
  const context = useContext(PostContext)
  if (!context) {
    throw new Error('usePost must be used within a PostProvider')
  }
  return context
}

// Sample posts data
const SAMPLE_POSTS = [
  {
    id: '1',
    userId: '1',
    content: 'Just finished building an amazing React app! The feeling when everything clicks together is incredible 🚀 #coding #react #webdev',
    images: ['https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop'],
    likes: ['2', '3', '4'],
    comments: [
      {
        id: 'c1',
        userId: '2',
        content: 'Looks amazing! What did you build?',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        likes: ['1', '3']
      },
      {
        id: 'c2',
        userId: '3',
        content: 'React is such a powerful framework! 💪',
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        likes: ['1']
      }
    ],
    saves: ['2', '3'],
    tags: ['@jane_smith'],
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '2',
    userId: '2',
    content: 'New UI design for a mobile app I\'m working on. What do you think? 🎨✨ #design #ui #ux #mobile',
    images: [
      'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600&h=400&fit=crop'
    ],
    likes: ['1', '3', '4', '5'],
    comments: [
      {
        id: 'c3',
        userId: '1',
        content: 'The color scheme is perfect! 🔥',
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        likes: ['2', '4']
      }
    ],
    saves: ['1', '4'],
    tags: [],
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '3',
    userId: '3',
    content: 'Captured this amazing sunset during my hike yesterday 🌅 Nature never fails to amaze me! #photography #nature #sunset #hiking',
    images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop'],
    likes: ['1', '2', '4'],
    comments: [],
    saves: ['1', '2'],
    tags: [],
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '4',
    userId: '4',
    content: 'Tried a new recipe today - homemade pasta with truffle sauce! 🍝 The aroma filled the entire kitchen. Recipe in comments! #cooking #pasta #foodie',
    images: ['https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600&h=400&fit=crop'],
    likes: ['1', '2', '3', '5'],
    comments: [
      {
        id: 'c4',
        userId: '5',
        content: 'This looks delicious! Can you share the recipe?',
        createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        likes: ['4']
      }
    ],
    saves: ['1', '3', '5'],
    tags: ['@mike_brown'],
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '5',
    userId: '5',
    content: 'Morning workout complete! 💪 Remember, consistency is key to achieving your fitness goals. What\'s your favorite exercise? #fitness #workout #motivation',
    images: ['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop'],
    likes: ['2', '4'],
    comments: [
      {
        id: 'c5',
        userId: '1',
        content: 'Great motivation! I love deadlifts 🏋️‍♂️',
        createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        likes: ['5']
      }
    ],
    saves: ['4'],
    tags: [],
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
  }
]

export const PostProvider = ({ children }) => {
  const { user } = useAuth()
  const [posts, setPosts] = useState(SAMPLE_POSTS)
  const [savedPosts, setSavedPosts] = useState([])

  useEffect(() => {
    // Load saved posts from localStorage
    if (user) {
      const saved = localStorage.getItem(`kokonsa_saved_${user.id}`)
      if (saved) {
        setSavedPosts(JSON.parse(saved))
      }
    }
  }, [user])

  const createPost = (postData) => {
    const newPost = {
      id: Date.now().toString(),
      userId: user.id,
      ...postData,
      likes: [],
      comments: [],
      saves: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    setPosts(prev => [newPost, ...prev])
    toast.success('Post created successfully!')
    return newPost
  }

  const updatePost = (postId, updatedData) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, ...updatedData, updatedAt: new Date().toISOString() }
        : post
    ))
    toast.success('Post updated successfully!')
  }

  const deletePost = (postId) => {
    setPosts(prev => prev.filter(post => post.id !== postId))
    toast.success('Post deleted successfully!')
  }

  const likePost = (postId) => {
    if (!user) return
    
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const isLiked = post.likes.includes(user.id)
        const updatedLikes = isLiked 
          ? post.likes.filter(id => id !== user.id)
          : [...post.likes, user.id]
        
        return { ...post, likes: updatedLikes }
      }
      return post
    }))
  }

  const savePost = (postId) => {
    if (!user) return
    
    const isSaved = savedPosts.includes(postId)
    let updatedSavedPosts
    
    if (isSaved) {
      updatedSavedPosts = savedPosts.filter(id => id !== postId)
      toast.success('Post removed from saved')
    } else {
      updatedSavedPosts = [...savedPosts, postId]
      toast.success('Post saved successfully!')
    }
    
    setSavedPosts(updatedSavedPosts)
    localStorage.setItem(`kokonsa_saved_${user.id}`, JSON.stringify(updatedSavedPosts))
    
    // Update post saves count
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const updatedSaves = isSaved 
          ? post.saves.filter(id => id !== user.id)
          : [...post.saves, user.id]
        
        return { ...post, saves: updatedSaves }
      }
      return post
    }))
  }

  const addComment = (postId, content) => {
    if (!user) return
    
    const newComment = {
      id: `c${Date.now()}`,
      userId: user.id,
      content,
      createdAt: new Date().toISOString(),
      likes: []
    }
    
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, comments: [...post.comments, newComment] }
        : post
    ))
    
    toast.success('Comment added!')
    return newComment
  }

  const updateComment = (postId, commentId, content) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const updatedComments = post.comments.map(comment => 
          comment.id === commentId 
            ? { ...comment, content, updatedAt: new Date().toISOString() }
            : comment
        )
        return { ...post, comments: updatedComments }
      }
      return post
    }))
    
    toast.success('Comment updated!')
  }

  const deleteComment = (postId, commentId) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const updatedComments = post.comments.filter(comment => comment.id !== commentId)
        return { ...post, comments: updatedComments }
      }
      return post
    }))
    
    toast.success('Comment deleted!')
  }

  const likeComment = (postId, commentId) => {
    if (!user) return
    
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const updatedComments = post.comments.map(comment => {
          if (comment.id === commentId) {
            const isLiked = comment.likes.includes(user.id)
            const updatedLikes = isLiked 
              ? comment.likes.filter(id => id !== user.id)
              : [...comment.likes, user.id]
            
            return { ...comment, likes: updatedLikes }
          }
          return comment
        })
        return { ...post, comments: updatedComments }
      }
      return post
    }))
  }

  const getPostById = (postId) => {
    return posts.find(post => post.id === postId)
  }

  const getPostsByUser = (userId) => {
    return posts.filter(post => post.userId === userId)
  }

  const getLikedPosts = (userId) => {
    return posts.filter(post => post.likes.includes(userId))
  }

  const getSavedPostsData = () => {
    return posts.filter(post => savedPosts.includes(post.id))
  }

  const searchPosts = (query) => {
    if (!query.trim()) return []
    
    const lowercaseQuery = query.toLowerCase()
    return posts.filter(post => 
      post.content.toLowerCase().includes(lowercaseQuery) ||
      post.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    )
  }

  const getKokonsaOfTheDay = () => {
    // Get the post with most likes from today
    const today = new Date()
    const todayPosts = posts.filter(post => {
      const postDate = new Date(post.createdAt)
      return postDate.toDateString() === today.toDateString()
    })
    
    if (todayPosts.length === 0) {
      // If no posts today, get the most liked post from recent posts
      return posts.sort((a, b) => b.likes.length - a.likes.length)[0]
    }
    
    return todayPosts.sort((a, b) => b.likes.length - a.likes.length)[0]
  }

  const getRelatedPosts = (postId, limit = 3) => {
    const currentPost = getPostById(postId)
    if (!currentPost) return []
    
    // Get posts from the same user or posts with similar tags
    const relatedPosts = posts.filter(post => {
      if (post.id === postId) return false
      
      // Same user posts
      if (post.userId === currentPost.userId) return true
      
      // Posts with similar content (simple keyword matching)
      const currentWords = currentPost.content.toLowerCase().split(' ')
      const postWords = post.content.toLowerCase().split(' ')
      const commonWords = currentWords.filter(word => 
        word.length > 3 && postWords.includes(word)
      )
      
      return commonWords.length > 0
    })
    
    return relatedPosts.slice(0, limit)
  }

  const value = {
    posts,
    createPost,
    updatePost,
    deletePost,
    likePost,
    savePost,
    addComment,
    updateComment,
    deleteComment,
    likeComment,
    getPostById,
    getPostsByUser,
    getLikedPosts,
    getSavedPostsData,
    searchPosts,
    getKokonsaOfTheDay,
    getRelatedPosts,
    savedPosts
  }

  return (
    <PostContext.Provider value={value}>
      {children}
    </PostContext.Provider>
  )
}