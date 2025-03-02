import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    // ページ読み込み時にトークンが有効か確認
    const token = localStorage.getItem('token');
    
    if (token) {
      // トークンがある場合、ユーザー情報を取得
      fetchCurrentUser(token);
    } else {
      setLoading(false);
    }
  }, []);
  
  // ユーザー情報を取得
  const fetchCurrentUser = async (token) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      
      const response = await axios.get(`${API_URL}/auth/me`, config);
      setCurrentUser(response.data);
      setLoading(false);
    } catch (err) {
      console.error('ユーザー情報の取得に失敗:', err);
      logout();
      setLoading(false);
    }
  };
  
  // ログイン処理
  const login = async (email, password) => {
    try {
      setError('');
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      const { token, user } = response.data;
      
      // トークンをlocalStorageに保存
      localStorage.setItem('token', token);
      
      // ユーザー情報をセット
      setCurrentUser(user);
      return user;
    } catch (err) {
      console.error('ログインに失敗:', err);
      setError(err.response?.data?.message || 'ログインに失敗しました');
      throw err;
    }
  };
  
  // 登録処理
  const register = async (userData) => {
    try {
      setError('');
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      const { token, user } = response.data;
      
      // トークンをlocalStorageに保存
      localStorage.setItem('token', token);
      
      // ユーザー情報をセット
      setCurrentUser(user);
      return user;
    } catch (err) {
      console.error('登録に失敗:', err);
      setError(err.response?.data?.message || '登録に失敗しました');
      throw err;
    }
  };
  
  // ログアウト処理
  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
  };
  
  const value = {
    currentUser,
    login,
    register,
    logout,
    loading,
    error,
    isAuthenticated: !!currentUser,
    isAdmin: currentUser?.role === 'admin',
    isModerator: ['admin', 'moderator'].includes(currentUser?.role),
    isContributor: ['admin', 'moderator', 'contributor'].includes(currentUser?.role)
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;