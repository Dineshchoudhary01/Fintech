import { createContext, useState, useContext, useEffect } from 'react';
import axiosInstance, { setAccessToken } from '../api/axiosInstance';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tryRefresh = async () => {
      try {
        const response = await axiosInstance.post('/auth/refresh');
        setAccessToken(response.data.accessToken);

        const profileRes = await axiosInstance.get('/auth/profile');
        setUser(profileRes.data.user);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    tryRefresh();
  }, []);

  const login = async (email, password) => {
    const response = await axiosInstance.post('/auth/login', { email, password });
    setAccessToken(response.data.accessToken);
    setUser(response.data.user);
  };

  const register = async (name, email, password) => {
    const response = await axiosInstance.post('/auth/register', { name, email, password });
    setAccessToken(response.data.accessToken);
    setUser(response.data.user);
  };

  const logout = async () => {
    try {
      await axiosInstance.post('/auth/logout');
    } catch (error) {
      console.log('Logout API call failed:', error);
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-500">Loading...</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}