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
      
      // トークンの有効性を確認（任意）
      verifyToken(storedToken);
    }
    
    setLoading(false);
  }, []);
  
  // トークンの有効性を確認
  const verifyToken = async (token) => {
    try {
      // サーバーAPIでトークンの有効性を確認
      await axios.get('/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (err) {
      // トークンが無効な場合はログアウト
      console.error('トークンが無効です:', err);
      logout();
    }
  };
  
  // ログイン処理
  const login = async (email, password) => {
    try {
      setError('');
      
      // APIを呼び出してログイン認証を行う
      const response = await axios.post('/api/auth/login', { 
        email, 
        password 
      });
      
      // レスポンスからトークンとユーザー情報を取得
      const { token, user } = response.data;
      
      // トークンをヘッダーに設定
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // ユーザー情報をローカルストレージに保存
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // ユーザー情報を状態に設定
      setCurrentUser(user);
      
      return user;
    } catch (err) {
      // APIエラーの処理
      if (err.response) {
        // サーバーからのエラーレスポンス
        setError(err.response.data?.message || 'メールアドレスまたはパスワードが正しくありません');
      } else if (err.request) {
        // リクエストは送信されたがレスポンスが返ってこない
        setError('サーバーに接続できませんでした。インターネット接続を確認してください。');
      } else {
        // リクエスト設定時に何らかのエラーが発生
        setError('ログイン処理中にエラーが発生しました。');
      }
      
      // 開発用モックデータ（サーバーAPI未実装時のフォールバック）
      if (process.env.NODE_ENV === 'development') {
        if (email === 'admin@example.com' && password === 'password') {
          const mockUser = {
            id: 1,
            name: '管理者 太郎',
            email: 'admin@example.com',
            department: 'IT部',
            role: 'admin',
            avatar_url: '/avatars/admin.jpg'
          };
          
          const mockToken = 'test_token_for_admin';
          
          // トークンをヘッダーに設定
          axios.defaults.headers.common['Authorization'] = `Bearer ${mockToken}`;
          
          // ユーザー情報をローカルストレージに保存
          localStorage.setItem('token', mockToken);
          localStorage.setItem('user', JSON.stringify(mockUser));
          
          // ユーザー情報を状態に設定
          setCurrentUser(mockUser);
          
          return mockUser;
        } else if (email === 'yamada@example.com' && password === 'password') {
          const mockUser = {
            id: 3,
            name: '山田 太郎',
            email: 'yamada@example.com',
            department: '営業部',
            role: 'contributor',
            avatar_url: '/avatars/yamada.jpg'
          };
          
          const mockToken = 'test_token_for_user';
          
          // トークンをヘッダーに設定
          axios.defaults.headers.common['Authorization'] = `Bearer ${mockToken}`;
          
          // ユーザー情報をローカルストレージに保存
          localStorage.setItem('token', mockToken);
          localStorage.setItem('user', JSON.stringify(mockUser));
          
          // ユーザー情報を状態に設定
          setCurrentUser(mockUser);
          
          return mockUser;
        }
      }
      
      throw err;
    }
  };
  
  // 新規登録処理
  const register = async (userData) => {
    try {
      setError('');
      
      // APIを呼び出して新規登録を行う
      const response = await axios.post('/api/auth/register', userData);
      
      // レスポンスからトークンとユーザー情報を取得
      const { token, user } = response.data;
      
      // トークンをヘッダーに設定
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // ユーザー情報をローカルストレージに保存
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // ユーザー情報を状態に設定
      setCurrentUser(user);
      
      return user;
    } catch (err) {
      // APIエラーの処理
      if (err.response) {
        // サーバーからのエラーレスポンス
        setError(err.response.data?.message || '新規登録に失敗しました');
      } else if (err.request) {
        // リクエストは送信されたがレスポンスが返ってこない
        setError('サーバーに接続できませんでした。インターネット接続を確認してください。');
      } else {
        // リクエスト設定時に何らかのエラーが発生
        setError('新規登録処理中にエラーが発生しました。');
      }
      
      // 開発用モックデータ（サーバーAPI未実装時のフォールバック）
      if (process.env.NODE_ENV === 'development') {
        const mockUser = {
          id: 10,
          name: userData.name,
          email: userData.email,
          department: userData.department,
          role: 'contributor',
          avatar_url: '/avatars/default.jpg'
        };
        
        const mockToken = 'test_token_for_new_user';
        
        // トークンをヘッダーに設定
        axios.defaults.headers.common['Authorization'] = `Bearer ${mockToken}`;
        
        // ユーザー情報をローカルストレージに保存
        localStorage.setItem('token', mockToken);
        localStorage.setItem('user', JSON.stringify(mockUser));
        
        // ユーザー情報を状態に設定
        setCurrentUser(mockUser);
        
        return mockUser;
      }
      
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