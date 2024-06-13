import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { checkUserLoggedIn, logoutUser } from '../services/AuthService';
import { firebase } from '../constants/firebaseConfig'; 


interface AuthContextType {
  isLoggedIn: boolean;
  userEmail: string | null;
  userId: string | null; 
  isLoading: boolean; 
  login: (email: string, userId: string) => void; 
  logout: () => void;
}


const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  userEmail: null,
  isLoading: true,
  userId: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null); 
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const loggedIn = await checkUserLoggedIn();
      if (loggedIn) {
        const user = firebase.auth().currentUser;
        if (user) {
          setIsLoggedIn(true);
          setUserEmail(user.email); 
          setUserId(user.uid); 
        }
      }
      setIsLoading(false); 
    };
    checkLoginStatus(); // Ejecuta checkLoginStatus al montar el componente
  }, []);
  
  const login = (email: string, userId: string) => {
    setIsLoggedIn(true);
    setUserEmail(email);
    setUserId(userId);
  };

  const logout = async () => {
    await logoutUser();
    setIsLoggedIn(false);
    setUserEmail(null);
    setUserId(null); 
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userEmail, userId, isLoading, login, logout }}> 
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);