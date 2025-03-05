import axios from 'axios';

// APIサービスのベースURL
// どの環境でも常にREACT_APP_API_URLを使用
const API_URL = process.env.REACT_APP_API_URL;

// Axiosのインスタンスを作成
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// リクエストインターセプター - トークンの追加
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// レスポンスインターセプター - エラーハンドリング
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // サーバーエラーの処理
      const { status } = error.response;
      
      if (status === 401) {
        // 認証エラー - ログアウト処理
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        // 必要に応じてページリロードまたはリダイレクト
        // window.location = '/login';
      }
      
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      // リクエストが送信されたがレスポンスがない場合
      console.error('Network Error:', error.request);
    } else {
      // その他のエラー
      console.error('Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;
