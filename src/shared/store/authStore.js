import { create } from 'zustand';
import { setCookie, deleteCookie, getCookie } from 'cookies-next';

export const useAuthStore = create((set) => ({
  // Core State
  // token: localStorage.getItem('auth_token') || null,
  // user: JSON.parse(localStorage.getItem('auth_user')) || null,
  // role: JSON.parse(localStorage.getItem('auth_role')) || null,
  // isAuthenticated: !!localStorage.getItem('auth_token'),

  // Actions
  // login: (userData, token) => {
  //   localStorage.setItem('auth_token', token);
  //   localStorage.setItem('auth_user', JSON.stringify(userData));
  //   localStorage.setItem('auth_role', JSON.stringify(userData.role));
  //   set({
  //     token,
  //     user: userData,
  //     role: userData.role,
  //     isAuthenticated: true,
  //   });
  // },

  // logout: () => {
  //   localStorage.removeItem('auth_token');
  //   localStorage.removeItem('auth_user');
  //   localStorage.removeItem('auth_role');
  //   set({
  //     token: null,
  //     user: null,
  //     role: null,
  //     isAuthenticated: false,
  //   });
  // },

  // Parse safe initial values from cookies
    token: getCookie('auth_token') || null,
    user: getCookie('auth_user'),
    role: getCookie('auth_role'),
    isAuthenticated: !!getCookie('auth_token'),

    login: (userData, token) => {
      // Persist values in application cookies
      setCookie('auth_token', token, { maxAge: 60 * 60 * 24 }); // 1 Day
      setCookie('auth_user', JSON.stringify(userData), { maxAge: 60 * 60 * 24 });
      setCookie('auth_role', JSON.stringify(userData.role), { maxAge: 60 * 60 * 24 });

      set({
        token,
        user: userData,
        role: userData.role,
        isAuthenticated: true,
      });
    },

    logout: () => {
      deleteCookie('auth_token');
      deleteCookie('auth_user');
      deleteCookie('auth_role');
      set({
        token: null,
        user: null,
        role: null,
        isAuthenticated: false,
      });
    },
}));