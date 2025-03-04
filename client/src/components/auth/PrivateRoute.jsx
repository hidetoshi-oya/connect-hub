import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const PrivateRoute = () => {
  const { currentUser, loading } = useAuth();
  
  // 認証情報のロード中は何も表示しない
  if (loading) {
    return null;
  }
  
  // ログインしていない場合はログインページにリダイレクト
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  // ログイン済みの場合は子ルートを表示
  return <Outlet />;
};

export default PrivateRoute;
