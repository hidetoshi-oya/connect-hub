import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Loading from '../ui/Loading';

const PrivateRoute = () => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();
  
  // 認証情報のロード中はローディング表示
  if (loading) {
    return <Loading />;
  }
  
  // ログインしていない場合はログインページにリダイレクト
  // 現在の場所を記憶して、ログイン後に戻れるようにstate情報を渡す
  if (!currentUser) {
    return <Navigate 
      to="/login" 
      state={{ from: location }} 
      replace 
    />;
  }
  
  // ログイン済みの場合は子ルートを表示
  return <Outlet />;
};

export default PrivateRoute;