import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Header.module.css';

const Header = () => {
  const { currentUser, logout, isAuthenticated, isAdmin } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        <Link to="/" className={styles.logo}>
          ConnectHub
        </Link>
        <span className={styles.tagline}>社内のつながりを育む</span>
      </div>

      <form className={styles.searchForm} onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="キーワードで検索..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
        <button type="submit" className={styles.searchButton}>
          検索
        </button>
      </form>

      <nav className={styles.nav}>
        {isAuthenticated ? (
          <>
            <div className={styles.userInfo}>
              <img
                src={currentUser.avatar_url || '/default-avatar.png'}
                alt={currentUser.name}
                className={styles.avatar}
              />
              <div className={styles.userDetails}>
                <span className={styles.userName}>{currentUser.name}</span>
                <span className={styles.userDepartment}>{currentUser.department}</span>
              </div>
            </div>

            <div className={styles.navLinks}>
              <Link to="/posts/create" className={styles.createPostBtn}>
                新規投稿
              </Link>
              <Link to={`/profile/${currentUser.id}`}>プロフィール</Link>
              {isAdmin && <Link to="/admin/users">管理者ページ</Link>}
              <button onClick={handleLogout} className={styles.logoutBtn}>
                ログアウト
              </button>
            </div>
          </>
        ) : (
          <div className={styles.authLinks}>
            <Link to="/login" className={styles.loginBtn}>
              ログイン
            </Link>
            <Link to="/register" className={styles.registerBtn}>
              登録
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;