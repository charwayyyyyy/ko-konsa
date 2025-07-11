# Kokonsa - Social Media Platform

<div align="center">
  <img src="./src/assets/images/logo.svg" alt="Kokonsa Logo" width="120" />
  <h3>Connect, Share, Discover</h3>
</div>

Kokonsa is an intended social media platform built with React and Tailwind CSS.

## Features

- **User Authentication**: Secure sign up, login, and profile management
- **Post Creation**: Share text, images, and mentions with rich formatting
- **Social Interactions**: Like, comment, and save posts to your collection
- **User Connections**: Follow/unfollow other users to customize your feed
- **Content Discovery**: Search for users and posts with real-time results
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dark Mode**: Toggle between light and dark themes based on preference
- **Offline Support**: Continue browsing even when your connection is lost
- **PWA Support**: Install as a standalone app on your device
- **"Kokonsa of the Day"**: Featured post highlighting popular content

## Tech Stack

- **Frontend**: React, React Router, Framer Motion for animations
- **Styling**: Tailwind CSS with dark mode support
- **State Management**: React Context API and Zustand
- **UI Components**: Custom components with Lucide React icons
- **Notifications**: React Hot Toast for elegant notifications
- **Date Handling**: Date-fns for date formatting and manipulation
- **Offline Support**: Service Worker with custom caching strategies
- **Build Tool**: Vite for fast development and optimized production builds

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/charwayyyyyy/ko-konsa.git
   cd ko-konsa
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn
   ```

3. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:5173` (or the URL shown in your terminal)

### Building for Production

1. Create a production build
   ```bash
   npm run build
   # or
   yarn build
   ```

2. Preview the production build locally
   ```bash
   npm run preview
   # or
   yarn preview
   ```

## Project Structure

```
/src
  /assets        # Images, icons, and other static assets
  /components    # Reusable UI components
    /Layout      # Layout components (Navbar, Sidebar, etc.)
    /Posts       # Post-related components
    /UI          # Generic UI components (Button, Card, etc.)
  /contexts      # React Context providers
    AuthContext.jsx    # Authentication context
    PostContext.jsx    # Post data and operations
    UserContext.jsx    # User data and operations
  /pages         # Application pages/routes
    Home.jsx           # Home feed page
    Login.jsx          # Login page
    Profile.jsx        # User profile page
    PostDetail.jsx     # Single post view
    SavedPosts.jsx     # Saved posts collection
    Search.jsx         # Search page
    Signup.jsx         # Registration page
    NotFound.jsx       # 404 page
  /utils         # Utility functions and helpers
    animationUtils.js  # Animation variants for Framer Motion
    commonUtils.js     # Common utility functions
    dateUtils.js       # Date formatting utilities
    offlineUtils.js    # Offline functionality helpers
    themeUtils.js      # Theme management utilities
  App.jsx        # Main application component
  main.jsx       # Entry point
  index.css      # Global styles
/public
  /assets        # Public static assets
  manifest.json  # PWA manifest
  sw.js          # Service Worker for offline support
```

## Demo Credentials

For testing purposes, you can use the following accounts:

### Regular User
- **Email**: john@example.com
- **Password**: password123
- **Username**: john_doe

### Content Creator
- **Email**: sarah@example.com
- **Password**: creator456
- **Username**: sarah_creator

### Admin User
- **Email**: admin@kokonsa.com
- **Password**: admin789
- **Username**: admin_kokonsa

## Features Guide

### Dark Mode
Toggle between light and dark mode using the theme switcher in the navigation bar. The app respects your system preference by default but allows manual override.



## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

