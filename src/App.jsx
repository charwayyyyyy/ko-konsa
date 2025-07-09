import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { PostProvider } from './contexts/PostContext'
import { UserProvider } from './contexts/UserContext'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Home from './pages/Home'
import Profile from './pages/Profile'
import PostDetail from './pages/PostDetail'
import SavedPosts from './pages/SavedPosts'
import Search from './pages/Search'
import NotFound from './pages/NotFound'
import Layout from './components/Layout/Layout'
import ScrollToTop from './components/UI/ScrollToTop'
import ErrorBoundary from './components/UI/ErrorBoundary'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  
  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
    </div>
  }
  
  return user ? children : <Navigate to="/login" />
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth()
  
  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
    </div>
  }
  
  return !user ? children : <Navigate to="/" />
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <UserProvider>
          <PostProvider>
            <Router>
              <ScrollToTop />
              <div className="min-h-screen bg-gray-50">
              <Routes>
                <Route path="/login" element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                } />
                <Route path="/signup" element={
                  <PublicRoute>
                    <Signup />
                  </PublicRoute>
                } />
                <Route path="/" element={
                  <ProtectedRoute>
                    <Layout>
                      <Home />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/profile/:username" element={
                  <ProtectedRoute>
                    <Layout>
                      <Profile />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/post/:id" element={
                  <ProtectedRoute>
                    <Layout>
                      <PostDetail />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/saved" element={
                  <ProtectedRoute>
                    <Layout>
                      <SavedPosts />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/search" element={
                  <ProtectedRoute>
                    <Layout>
                      <Search />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster 
                position="top-right"
                toastOptions={{
                  duration: 3000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },
                }}
              />
            </div>
            </Router>
          </PostProvider>
        </UserProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App