import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export const useAuthSync = () => {
  const { user, token } = useAuth();
  
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken && !user) {
      console.warn('Auth context out of sync! Reloading...');
      window.location.reload();
    }
    
    if ((!storedUser || !storedToken) && user) {
      console.warn('LocalStorage cleared but user still in context! Logging out...');
      const logout = () => {
        localStorage.clear();
        window.location.href = '/';
      };
      logout();
    }
  }, [user, token]);
  
  return { user, token };
};