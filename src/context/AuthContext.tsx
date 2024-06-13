import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { checkUserLoggedIn, logoutUser } from '../services/AuthService';
import { firebase } from '../constants/firebaseConfig'; 


interface AuthContextType {
  isLoggedIn: boolean;
  userEmail: string | null;
  userId: string | null; // Agrega userId al contexto
  isLoading: boolean; 
  login: (email: string, userId: string) => void; // Actualiza login para aceptar userId
  logout: () => void;
}


const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  userEmail: null,
  isLoading: true,
  userId: null, // <-- Agrega userId aquí con un valor inicial 
  login: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null); // Agrega estado para userId
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const loggedIn = await checkUserLoggedIn();
      if (loggedIn) {
        const user = firebase.auth().currentUser;
        if (user) {
          setIsLoggedIn(true);
          setUserEmail(user.email); 
          setUserId(user.uid); // Guarda el userId en el estado
        }
      }
      setIsLoading(false); 
    };
    checkLoginStatus();
  }, []);
  
  const login = (email: string, userId: string) => { // Actualiza la función login
    setIsLoggedIn(true);
    setUserEmail(email);
    setUserId(userId);
  };

  const logout = async () => {
    await logoutUser();
    setIsLoggedIn(false);
    setUserEmail(null);
    setUserId(null); // Limpia el userId al cerrar sesión
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userEmail, userId, isLoading, login, logout }}> 
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);