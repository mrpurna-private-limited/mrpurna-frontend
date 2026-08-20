'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser as apiLogin, registerUser as apiRegister, fetchUserProfile } from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const savedToken = localStorage.getItem('mrpurna_token');
      const savedProfile = localStorage.getItem('mrpurna_profile');
      if (savedToken && savedProfile) {
        setToken(savedToken);
        setProfile(JSON.parse(savedProfile));
        // Refresh role and identity from the API. This prevents the UI from
        // trusting stale local storage after a role change or expired session.
        fetchUserProfile().then((data) => {
          if (data.success) {
            setProfile(data.profile);
            localStorage.setItem('mrpurna_profile', JSON.stringify(data.profile));
          }
        }).catch(() => {
          setToken(null);
          setProfile(null);
          localStorage.removeItem('mrpurna_token');
          localStorage.removeItem('mrpurna_profile');
        });
      }
    } catch (e) {}
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const data = await apiLogin(email, password);
    if (data.success) {
      setToken(data.token);
      setProfile(data.profile);
      localStorage.setItem('mrpurna_token', data.token);
      localStorage.setItem('mrpurna_profile', JSON.stringify(data.profile));
      return data;
    }
    throw new Error(data.message || 'Login failed');
  };

  const register = async (name, email, password) => {
    const data = await apiRegister(name, email, password);
    if (data.success) {
      setToken(data.token);
      setProfile(data.profile);
      localStorage.setItem('mrpurna_token', data.token);
      localStorage.setItem('mrpurna_profile', JSON.stringify(data.profile));
      return data;
    }
    throw new Error(data.message || 'Registration failed');
  };

  const logout = () => {
    setToken(null);
    setProfile(null);
    localStorage.removeItem('mrpurna_token');
    localStorage.removeItem('mrpurna_profile');
  };

  const isAdmin = profile && profile.role === 'admin';

  return (
    <AuthContext.Provider value={{
      profile,
      token,
      loading,
      login,
      register,
      logout,
      isAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
