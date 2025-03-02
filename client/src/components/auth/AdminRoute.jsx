import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AdminRoute = () => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  // 認証状態の読み込み中は何も表示しない
  if (loading) {
    return <div>Loading...</div>;
  }

  // 認証されていないか管理者でない場合はホームページにリダイレクト
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!isAdmin) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default AdminRoute;