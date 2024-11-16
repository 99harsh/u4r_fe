import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { jwtDecode } from 'jwt-decode';

interface AuthContextType {
  isAuthenticated: boolean;
  isInitialized: boolean;
  user: any;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isInitialized: false,
  user: null,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [user, setUser] = useState(null);
  const expiryTimerRef = useRef<NodeJS.Timeout | null>(null);

  const checkTokenExpiry = useCallback(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decoded.exp && decoded.exp < currentTime) {
          logout();
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        logout();
      }
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    if (expiryTimerRef.current) {
      clearInterval(expiryTimerRef.current);
      expiryTimerRef.current = null;
    }
  }, []);

  const login = useCallback((token: string) => {
    console.log("login", token);
    localStorage.setItem('token', token);
    const decoded: any = jwtDecode(token);
    setUser(decoded);
    setIsAuthenticated(true);
    if (expiryTimerRef.current) {
      clearInterval(expiryTimerRef.current);
    }
    expiryTimerRef.current = setInterval(checkTokenExpiry, 60000);
  }, [checkTokenExpiry]);

  useEffect(() => {
    const initializeAuth = () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decoded: any = jwtDecode(token);
          const currentTime = Date.now() / 1000;
          if (decoded.exp && decoded.exp > currentTime) {
            setUser(decoded);
            setIsAuthenticated(true);
            // Set up periodic token expiry check
            expiryTimerRef.current = setInterval(checkTokenExpiry, 60000); // Check every minute
          } else {
            console.log('Token expired on load, logging out');
            logout();
          }
        } catch (error) {
          console.error('Invalid token:', error);
          logout();
        }
      }
      setIsInitialized(true);
    };

    initializeAuth();

    // Cleanup function
    return () => {
      if (expiryTimerRef.current) {
        clearInterval(expiryTimerRef.current);
      }
    };
  }, [checkTokenExpiry, logout]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isInitialized, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};