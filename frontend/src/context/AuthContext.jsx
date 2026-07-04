import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('finesse_token'));
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      axios.get('/api/auth/verify')
        .then(() => setIsAdmin(true))
        .catch(() => { setToken(null); localStorage.removeItem('finesse_token'); })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (username, password) => {
    const { data } = await axios.post('/api/auth/login', { username, password });
    setToken(data.token);
    setIsAdmin(true);
    localStorage.setItem('finesse_token', data.token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    return data;
  };

  const logout = () => {
    setToken(null);
    setIsAdmin(false);
    localStorage.removeItem('finesse_token');
    delete axios.defaults.headers.common['Authorization'];
  };

  return <AuthContext.Provider value={{ token, isAdmin, loading, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
