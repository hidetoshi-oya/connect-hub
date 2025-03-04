import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// 認証コンテキストを作成
const AuthContext = createContext();

// コンテキストを使用するためのカスタムフック
export const useAuth = () => {
  return useContext(AuthContext);
};

// 認証プロバイダーコンポーネント
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // 初期化時にローカルストレージからユーザー情報を取得
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      setCurrentUser(JSON.parse(storedUser));
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }
    
    setLoading(false);
  }, []);
  
  // ログイン処理
  const login = async (email, password) => {
    try {
      setError('');
      
      // 実際はAPIを呼び出してログイン認証を行う
      // const response = await axios.post('/api/auth/login', { email, password });
      
      // 開発用モックデータ
      let mockResponse;
      
      if (email === 'admin@example.com' && password === 'password') {
        mockResponse = {
          token: 'test_token_for_admin',
          user: {
            id: 1,
            name: '管理者 太郎',
            email: 'admin@example.com',
            department: 'IT部',
            role: 'admin',
            avatar_url: '/avatars/admin.jpg'
          }
        };
      } else if (email === 'yamada@example.com' && password === 'password') {
        mockResponse = {
          token: 'test_token_for_user',
          user: {
            id: 3,
            name: '山田 太郎',
            email: 'yamada@example.com',
            department: '営業部',
            role: 'contributor',
            avatar_url: '/avatars/yamada.jpg'
          }
        };
      } else {
        throw new Error('メールアドレスまたはパスワードが正しくありません');
      }
      
      // トークンをヘッダーに設定
      axios.defaults.headers.common['Authorization'] = `Bearer ${mockResponse.token}`;
      
      // ユーザー情報をローカルストレージに保存
      localStorage.setItem('token', mockResponse.token);
      localStorage.setItem('user', JSON.stringify(mockResponse.user));
      
      // ユーザー情報を状態に設定
      setCurrentUser(mockResponse.user);
      
      return mockResponse.user;
    } catch (err) {
      setError(err.message || 'ログインに失敗しました');
      throw err;
    }
  };
  
  // 新規登録処理
  const register = async (userData) => {
    try {
      setError('');
      
      // 実際はAPIを呼び出して新規登録を行う
      // const response = await axios.post('/api/auth/register', userData);
      
      // 開発用モックデータ
      const mockResponse = {
        token: 'test_token_for_new_user',
        user: {
          id: 10,
          name: userData.name,
          email: userData.email,
          department: userData.department,
          role: 'contributor',
          avatar_url: '/avatars/default.jpg'
        }
      };
      
      // トークンをヘッダーに設定
      axios.defaults.headers.common['Authorization'] = `Bearer ${mockResponse.token}`;
      
      // ユーザー情報をローカルストレージに保存
      localStorage.setItem('token', mockResponse.token);
      localStorage.setItem('user', JSON.stringify(mockResponse.user));
      
      // ユーザー情報を状態に設定
      setCurrentUser(mockResponse.user);
      
      return mockResponse.user;
    } catch (err) {
      setError(err.message || '新規登録に失敗しました');
      throw err;
    }
  };
  
  // ログアウト処理
  const logout = () => {
    // トークンとユーザー情報をローカルストレージから削除
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // ヘッダーからトークンを削除
    delete axios.defaults.headers.common['Authorization'];
    
    // ユーザー情報をクリア
    setCurrentUser(null);
  };
  
  // プロバイダーに渡す値
  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout
  };
  
  // コンテキストプロバイダーを返す
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
