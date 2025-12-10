// src/contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { getCurrentUserData, isAuthenticated, getCurrentUser, logoutUser as apiLogoutUser } from '../api';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if user is authenticated
        const hasAuth = isAuthenticated();
        console.log('🔐 Auth check - hasAuth:', hasAuth);

        if (hasAuth) {
          // Get user from localStorage first (faster, works offline)
          const storedUser = getCurrentUserData();
          console.log('🔐 Stored user:', storedUser);
          
          if (storedUser) {
            // Set user immediately from localStorage
            setUser(storedUser);
          }

          // Then try to fetch fresh data from API in background
          try {
            const userData = await getCurrentUser();
            console.log('🔐 Fresh user data from API:', userData);
            
            // Update if we got fresh data
            if (userData) {
              setUser(userData);
              // Update localStorage with fresh data
              localStorage.setItem('user', JSON.stringify(userData));
            }
          } catch (apiError) {
            // API call failed, but we already have user from localStorage
            console.warn('🔐 Could not fetch fresh user data, using stored data:', apiError.message);
            
            // If we don't have stored user either, clear auth
            if (!storedUser) {
              console.log('🔐 No stored user and API failed, clearing auth');
              localStorage.removeItem('auth_token');
              localStorage.removeItem('user');
              setUser(null);
            }
            // Don't set error here - just log it
            // The app should work with stored user data
          }
        } else {
          console.log('🔐 No authentication found');
        }
      } catch (err) {
        console.error('🔐 Auth check error:', err);
        // Don't throw error - just log it and continue
        // The app should still render without user
      } finally {
        console.log('🔐 Auth check complete, setting loading to false');
        setLoading(false);
      }
    };

    checkAuth();

    // Listen for storage changes (for cross-tab logout)
    const handleStorageChange = (e) => {
      if (e.key === 'auth_token' || e.key === 'user') {
        console.log('🔐 Storage changed, rechecking auth');
        checkAuth();
      }
    };

    // Listen for auth expiration events
    const handleAuthExpired = () => {
      console.log('🔐 Auth expired event received');
      setUser(null);
      setError('Session expired. Please login again.');
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('auth_expired', handleAuthExpired);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth_expired', handleAuthExpired);
    };
  }, []);

  const login = useCallback((userData, token) => {
    try {
      console.log('🔐 Login called with user:', userData);
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setError(null);
      return true;
    } catch (err) {
      console.error('🔐 Login storage error:', err);
      setError('Failed to save authentication data');
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      console.log('🔐 Logout initiated');
      // Try to call logout API, but don't fail if it errors
      await apiLogoutUser();
    } catch (err) {
      console.warn('🔐 Logout API call failed (continuing anyway):', err);
    } finally {
      // Always clear local data
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      setUser(null);
      setError(null);
      console.log('🔐 Logout complete');
    }
  }, []);

  const updateUser = useCallback((userData) => {
    try {
      console.log('🔐 Updating user:', userData);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return true;
    } catch (err) {
      console.error('🔐 Update user error:', err);
      setError('Failed to update user data');
      return false;
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      console.log('🔐 Refreshing user data');
      if (isAuthenticated()) {
        const userData = await getCurrentUser();
        if (userData) {
          updateUser(userData);
          return userData;
        }
      }
      return null;
    } catch (err) {
      console.error('🔐 Refresh user error:', err);
      // Don't set error - use existing user data
      return user; // Return current user if refresh fails
    }
  }, [updateUser, user]);

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    logout,
    updateUser,
    refreshUser,
    clearError: () => setError(null)
  };

  console.log('🔐 AuthProvider rendering - user:', user?.email || 'none', 'loading:', loading);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};