import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Monitor } from 'lucide-react';
import { THEMES, getTheme, setTheme } from '../../utils/themeUtils';
import { cn } from '../../utils/commonUtils';

/**
 * ThemeToggle component that allows users to switch between light, dark, and system themes
 * 
 * @param {Object} props - Component props
 * @param {string} props.className - Additional CSS classes
 */
const ThemeToggle = ({ className = '' }) => {
  const [currentTheme, setCurrentTheme] = useState(getTheme());
  
  // Update component state when theme changes
  useEffect(() => {
    setCurrentTheme(getTheme());
  }, []);
  
  // Handle theme change
  const handleThemeChange = (theme) => {
    setTheme(theme);
    setCurrentTheme(theme);
  };
  
  // Theme options with their icons
  const themeOptions = [
    { value: THEMES.LIGHT, icon: Sun, label: 'Light' },
    { value: THEMES.DARK, icon: Moon, label: 'Dark' },
    { value: THEMES.SYSTEM, icon: Monitor, label: 'System' },
  ];
  
  return (
    <div className={cn('flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1', className)}>
      {themeOptions.map(({ value, icon: Icon, label }) => {
        const isActive = currentTheme === value;
        
        return (
          <motion.button
            key={value}
            type="button"
            onClick={() => handleThemeChange(value)}
            className={cn(
              'flex items-center justify-center rounded-md p-2 text-sm font-medium transition-colors',
              isActive
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            )}
            whileTap={{ scale: 0.95 }}
            title={label}
            aria-label={`Switch to ${label} theme`}
          >
            <Icon size={18} />
          </motion.button>
        );
      })}
    </div>
  );
};

export default ThemeToggle;