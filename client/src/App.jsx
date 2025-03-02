import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/auth/PrivateRoute';
import AdminRoute from './components/auth/AdminRoute';

// レイアウト
import Layout from './components/layout/Layout';

// ページ
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PostDetail from './pages/PostDetail';
import Profile from './pages/Profile';
import CreatePost from './pages/CreatePost';
import EditPost from './pages/EditPost';

// 管理ページ
import UserManagement from './pages/admin/UserManagement';
import CategoryManagement from './pages/admin/CategoryManagement';

// スタイル
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="posts/:id" element={<PostDetail />} />
            <Route path="profile/:id" element={<Profile />} />
            
            {/* 認証が必要なルート */}
            <Route element={<PrivateRoute />}>
              <Route path="posts/create" element={<CreatePost />} />
              <Route path="posts/edit/:id" element={<EditPost />} />
            </Route>
            
            {/* 管理者専用ルート */}
            <Route element={<AdminRoute />}>
              <Route path="admin/users" element={<UserManagement />} />
              <Route path="admin/categories" element={<CategoryManagement />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;