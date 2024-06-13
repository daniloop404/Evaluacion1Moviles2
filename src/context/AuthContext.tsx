import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { checkUserLoggedIn, logoutUser } from '../services/AuthService';
import { firebase } from '../constants/firebaseConfig'; 

interface AuthContextType {
  isLoggedIn: boolean;
  userEmail: string | null;
  login: (email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  userEmail: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const loggedIn = await checkUserLoggedIn();
      if (loggedIn) {
        const user = firebase.auth().currentUser;
        setIsLoggedIn(true);
        setUserEmail(user?.email || null);
      }
    };
    checkLoginStatus();
  }, []);

  const login = (email: string) => {
    setIsLoggedIn(true);
    setUserEmail(email);
  };

  const logout = async () => {
    await logoutUser();
    setIsLoggedIn(false);
    setUserEmail(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userEmail, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);