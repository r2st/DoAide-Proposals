import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api, getToken, setToken } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = useCallback(async () => {
    if (!getToken()) {
      setLoading(false);
      return;
    }
    const { data, error } = await api.get('/auth/me');
    if (error) {
      setToken(null);
      setUser(null);
    } else {
      setUser(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  const login = async (email, password) => {
    const { data, error } = await api.login(email, password);
    if (error) return { error };
    await fetchMe();
    return { data };
  };

  const register = async (payload) => {
    const { data, error } = await api.register(payload);
    if (error) return { error };
    setUser(data.user);
    return { data };
  };

  const logout = () => {
    api.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
