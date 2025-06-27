
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  points: number;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  updateUserPoints: (points: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is logged in (localStorage simulation)
    const savedUser = localStorage.getItem('quanttun_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate login
    const userData = {
      id: '1',
      name: 'Estudante',
      email,
      points: 0
    };
    setUser(userData);
    localStorage.setItem('quanttun_user', JSON.stringify(userData));
  };

  const loginWithGoogle = async () => {
    // Simulate Google login
    const userData = {
      id: '1',
      name: 'Estudante Google',
      email: 'estudante@gmail.com',
      points: 0
    };
    setUser(userData);
    localStorage.setItem('quanttun_user', JSON.stringify(userData));
  };

  const register = async (name: string, email: string, password: string) => {
    // Simulate registration
    const userData = {
      id: '1',
      name,
      email,
      points: 0
    };
    setUser(userData);
    localStorage.setItem('quanttun_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('quanttun_user');
  };

  const updateUserPoints = (points: number) => {
    if (user) {
      const updatedUser = { ...user, points: user.points + points };
      setUser(updatedUser);
      localStorage.setItem('quanttun_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        loginWithGoogle,
        register,
        logout,
        isAuthenticated: !!user,
        updateUserPoints
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
