/**
 * Utility functions for handling theme (dark/light mode)
 */

/**
 * Theme options
 */
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system'
};

/**
 * Get the current theme from localStorage or default to system
 * @returns {string} - Current theme (light, dark, or system)
 */
export const getTheme = () => {
  try {
    return localStorage.getItem('kokonsa_theme') || THEMES.SYSTEM;
  } catch (error) {
    console.error('Error getting theme from localStorage:', error);
    return THEMES.SYSTEM;
  }
};

/**
 * Set the theme in localStorage and apply it to the document
 * @param {string} theme - Theme to set (light, dark, or system)
 */
export const setTheme = (theme) => {
  try {
    // Save theme preference to localStorage
    localStorage.setItem('kokonsa_theme', theme);
    
    // Apply the theme
    applyTheme(theme);
    
    return true;
  } catch (error) {
    console.error('Error setting theme:', error);
    return false;
  }
};

/**
 * Apply the theme to the document
 * @param {string} theme - Theme to apply (light, dark, or system)
 */
export const applyTheme = (theme) => {
  // Get system preference if theme is 'system'
  const isDark = theme === THEMES.DARK || 
    (theme === THEMES.SYSTEM && window.matchMedia('(prefers-color-scheme: dark)').matches);
  
  // Apply dark class to document
  if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

/**
 * Initialize theme based on stored preference
 */
export const initializeTheme = () => {
  // Get theme from localStorage
  const theme = getTheme();
  
  // Apply theme
  applyTheme(theme);
  
  // Listen for system preference changes if theme is 'system'
  if (theme === THEMES.SYSTEM) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Define listener function
    const handleChange = (e) => {
      applyTheme(THEMES.SYSTEM);
    };
    
    // Add listener
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
    }
    
    // Return cleanup function
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        // Fallback for older browsers
        mediaQuery.removeListener(handleChange);
      }
    };
  }
  
  return () => {}; // Empty cleanup function if not system theme
};

/**
 * Toggle between light and dark mode
 * @returns {string} - New theme
 */
export const toggleTheme = () => {
  const currentTheme = getTheme();
  let newTheme;
  
  // If current theme is system, switch to light/dark based on system preference
  if (currentTheme === THEMES.SYSTEM) {
    newTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 
      THEMES.LIGHT : THEMES.DARK;
  } 
  // Otherwise toggle between light and dark
  else {
    newTheme = currentTheme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK;
  }
  
  setTheme(newTheme);
  return newTheme;
};