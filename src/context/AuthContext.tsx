import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { checkUserLoggedIn, logoutUser } from '../services/AuthService';
import { firebase } from '../constants/firebaseConfig'; 


interface AuthContextType {
  isLoggedIn: boolean;
  userEmail: string | null;
  isLoading: boolean; // ¡Añade isLoading a la interfaz!
  login: (email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  userEmail: null,
  isLoading: true, // ¡Añade el valor inicial de isLoading aquí! 
  login: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const checkLoginStatus = async () => {
      const loggedIn = await checkUserLoggedIn();
      if (loggedIn) {
        const user = firebase.auth().currentUser;
        if (user) {
          setIsLoggedIn(true);
          setUserEmail(user.email); 
        }
      }
      setIsLoading(false); // Actualiza isLoading después de la verificación
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
    <AuthContext.Provider value={{ isLoggedIn, userEmail, isLoading, login, logout }}> 
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);