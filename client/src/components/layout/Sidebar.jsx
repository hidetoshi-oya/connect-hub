import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Sidebar.module.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Sidebar = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_URL}/categories`);
        setCategories(response.data);
        setLoading(false);
      } catch (err) {
        console.error('カテゴリの取得に失敗:', err);
        setError('カテゴリの読み込みに失敗しました');
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // 現在のカテゴリを取得
  const getCurrentCategory = () => {
    const params = new URLSearchParams(location.search);
    return params.get('category') || 'all';
  };

  // メニュー項目がアクティブかどうかを確認
  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') {
      return !location.search || getCurrentCategory() === 'all';
    }
    return location.pathname === path;
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarContent}>
        <nav className={styles.navigation}>
          <ul className={styles.navList}>
            <li className={isActive('/') ? styles.active : ''}>
              <Link to="/">全ての投稿</Link>
            </li>
            {isAuthenticated && (
              <li className={isActive('/posts/create') ? styles.active : ''}>
                <Link to="/posts/create">新規投稿</Link>
              </li>
            )}
            <li className={location.search?.includes('pinned=true') ? styles.active : ''}>
              <Link to="/?pinned=true">ピン留め投稿</Link>
            </li>
          </ul>
        </nav>

        <div className={styles.categorySection}>
          <h3 className={styles.sectionTitle}>カテゴリ</h3>
          {loading ? (
            <p>カテゴリを読み込み中...</p>
          ) : error ? (
            <p className={styles.error}>{error}</p>
          ) : (
            <ul className={styles.categoryList}>
              {categories.map((category) => (
                <li
                  key={category.id}
                  className={
                    getCurrentCategory() === category.name ? styles.active : ''
                  }
                >
                  <Link to={`/?category=${encodeURIComponent(category.name)}`}>
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className={styles.departmentSection}>
          <h3 className={styles.sectionTitle}>部署</h3>
          <ul className={styles.departmentList}>
            <li
              className={
                getCurrentCategory() === 'IT部' ? styles.active : ''
              }
            >
              <Link to="/?category=IT部">IT部</Link>
            </li>
            <li
              className={
                getCurrentCategory() === '営業部' ? styles.active : ''
              }
            >
              <Link to="/?category=営業部">営業部</Link>
            </li>
            <li
              className={
                getCurrentCategory() === '開発部' ? styles.active : ''
              }
            >
              <Link to="/?category=開発部">開発部</Link>
            </li>
            <li
              className={
                getCurrentCategory() === '人事部' ? styles.active : ''
              }
            >
              <Link to="/?category=人事部">人事部</Link>
            </li>
            <li
              className={
                getCurrentCategory() === '広報部' ? styles.active : ''
              }
            >
              <Link to="/?category=広報部">広報部</Link>
            </li>
            <li
              className={
                getCurrentCategory() === 'マーケティング部' ? styles.active : ''
              }
            >
              <Link to="/?category=マーケティング部">マーケティング部</Link>
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;