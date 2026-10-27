import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  // Core State
  token: localStorage.getItem('auth_token') || null,
  user: JSON.parse(localStorage.getItem('auth_user')) || null,
  role: JSON.parse(localStorage.getItem('auth_role')) || null,
  isAuthenticated: !!localStorage.getItem('auth_token'),

  // Actions
  login: (userData, token) => {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_user', JSON.stringify(userData));
    localStorage.setItem('auth_role', JSON.stringify(userData.role));
    set({
      token,
      user: userData,
      role: userData.role,
      isAuthenticated: true,
    });
  },

  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    set({
      token: null,
      user: null,
      role: null,
      isAuthenticated: false,
    });
  },
}));