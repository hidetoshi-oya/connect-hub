import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const PrivateRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  // 認証状態の読み込み中は何も表示しない
  if (loading) {
    return <div>Loading...</div>;
  }

  // 認証されていない場合はログインページにリダイレクト
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;