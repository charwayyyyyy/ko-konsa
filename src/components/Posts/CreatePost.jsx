import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Image, 
  Smile, 
  MapPin, 
  Calendar, 
  X, 
  Plus,
  AtSign,
  Hash
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { usePost } from '../../contexts/PostContext'
import { useUser } from '../../contexts/UserContext'
import toast from 'react-hot-toast'

const CreatePost = () => {
  const { user, loading } = useAuth()
  const { createPost } = usePost()
  const { users } = useUser()
  const [content, setContent] = useState('')
  const [images, setImages] = useState([])
  const [isExpanded, setIsExpanded] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showUserSuggestions, setShowUserSuggestions] = useState(false)
  const [userSuggestions, setUserSuggestions] = useState([])
  const [cursorPosition, setCursorPosition] = useState(0)
  const textareaRef = useRef(null)
  const fileInputRef = useRef(null)

  const emojis = ['😀', '😂', '🥰', '😍', '🤔', '👍', '🎉', '❤️', '🔥', '💯', '🚀', '✨']

  const handleContentChange = (e) => {
    const value = e.target.value
    const position = e.target.selectionStart
    
    setContent(value)
    setCursorPosition(position)
    
    // Check for @ mentions
    const words = value.split(' ')
    const currentWord = words[words.length - 1]
    
    if (currentWord.startsWith('@') && currentWord.length > 1) {
      const query = currentWord.slice(1).toLowerCase()
      const suggestions = users.filter(u => 
        u.username.toLowerCase().includes(query) && u.id !== user.id
      ).slice(0, 5)
      
      setUserSuggestions(suggestions)
      setShowUserSuggestions(suggestions.length > 0)
    } else {
      setShowUserSuggestions(false)
    }
  }

  const handleUserSelect = (selectedUser) => {
    const words = content.split(' ')
    words[words.length - 1] = `@${selectedUser.username}`
    setContent(words.join(' ') + ' ')
    setShowUserSuggestions(false)
    textareaRef.current?.focus()
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          setImages(prev => [...prev, {
            id: Date.now() + Math.random(),
            url: e.target.result,
            file
          }])
        }
        reader.readAsDataURL(file)
      }
    })
  }

  const removeImage = (imageId) => {
    setImages(prev => prev.filter(img => img.id !== imageId))
  }

  const addEmoji = (emoji) => {
    const newContent = content.slice(0, cursorPosition) + emoji + content.slice(cursorPosition)
    setContent(newContent)
    setShowEmojiPicker(false)
    textareaRef.current?.focus()
  }

  const handleSubmit = () => {
    if (!content.trim() && images.length === 0) {
      toast.error('Please add some content or images')
      return
    }

    // Extract tags from content
    const tags = content.match(/@\w+/g) || []
    
    const postData = {
      content: content.trim(),
      images: images.map(img => img.url),
      tags
    }

    createPost(postData)
    
    // Reset form
    setContent('')
    setImages([])
    setIsExpanded(false)
    setShowEmojiPicker(false)
    setShowUserSuggestions(false)
  }

  if (loading || !user) {
    return null;
  }
  
  return (
    <motion.div
      data-create-post
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-6"
    >
      <div className="flex space-x-4">
        <img
          src={user.avatar}
          alt={user.name}
          className="w-12 h-12 rounded-full object-cover flex-shrink-0"
        />
        
        <div className="flex-1">
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={content}
              onChange={handleContentChange}
              onFocus={() => setIsExpanded(true)}
              placeholder="What's on your mind?"
              className="w-full resize-none border-none outline-none text-lg placeholder-gray-500 bg-transparent"
              rows={isExpanded ? 4 : 2}
              style={{ minHeight: isExpanded ? '120px' : '60px' }}
            />
            
            {/* User Suggestions */}
            <AnimatePresence>
              {showUserSuggestions && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-40 overflow-y-auto"
                >
                  {userSuggestions.map(suggestedUser => (
                    <button
                      key={suggestedUser.id}
                      onClick={() => handleUserSelect(suggestedUser)}
                      className="w-full flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 transition-colors text-left"
                    >
                      <img
                        src={suggestedUser.avatar}
                        alt={suggestedUser.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{suggestedUser.name}</p>
                        <p className="text-sm text-gray-500">@{suggestedUser.username}</p>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Image Preview */}
          <AnimatePresence>
            {images.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 grid grid-cols-2 gap-2"
              >
                {images.map(image => (
                  <motion.div
                    key={image.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative group"
                  >
                    <img
                      src={image.url}
                      alt="Upload preview"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => removeImage(image.id)}
                      className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Emoji Picker */}
          <AnimatePresence>
            {showEmojiPicker && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-4 p-4 bg-gray-50 rounded-lg"
              >
                <div className="grid grid-cols-6 gap-2">
                  {emojis.map(emoji => (
                    <button
                      key={emoji}
                      onClick={() => addEmoji(emoji)}
                      className="text-2xl hover:bg-gray-200 rounded p-2 transition-colors"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Actions */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-4 flex items-center justify-between"
              >
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors"
                  >
                    <Image size={20} />
                    <span className="text-sm font-medium">Photo</span>
                  </button>
                  
                  <button
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="flex items-center space-x-2 text-yellow-600 hover:text-yellow-700 transition-colors"
                  >
                    <Smile size={20} />
                    <span className="text-sm font-medium">Emoji</span>
                  </button>
                  
                  <button className="flex items-center space-x-2 text-green-600 hover:text-green-700 transition-colors">
                    <MapPin size={20} />
                    <span className="text-sm font-medium">Location</span>
                  </button>
                  
                  <button className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 transition-colors">
                    <Calendar size={20} />
                    <span className="text-sm font-medium">Schedule</span>
                  </button>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="text-sm text-gray-500">
                    {content.length}/280
                  </div>
                  
                  <button
                    onClick={handleSubmit}
                    disabled={!content.trim() && images.length === 0}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Post
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageUpload}
        className="hidden"
      />
    </motion.div>
  )
}

export default CreatePost