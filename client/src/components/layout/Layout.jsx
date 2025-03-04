import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// スタイル - 将来的にはモジュールCSSを作成
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  header: {
    backgroundColor: 'white',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    padding: '1rem 0',
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#4a90e2',
  },
  nav: {
    display: 'flex',
    gap: '1.5rem',
  },
  navItem: {
    color: '#4a5568',
    textDecoration: 'none',
  },
  userMenu: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  userButton: {
    display: 'flex',
    alignItems: 'center',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
  },
  userAvatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    marginRight: '0.5rem',
  },
  userName: {
    marginRight: '0.25rem',
  },
  userRole: {
    fontSize: '0.8rem',
    color: '#6c757d',
    marginLeft: '0.25rem',
  },
  dropdown: {
    position: 'absolute',
    top: '40px',
    right: 0,
    backgroundColor: 'white',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    borderRadius: '4px',
    padding: '0.5rem 0',
    zIndex: 100,
    minWidth: '200px',
  },
  dropdownItem: {
    display: 'block',
    padding: '0.5rem 1rem',
    color: '#4a5568',
    textDecoration: 'none',
  },
  dropdownItemHover: {
    backgroundColor: '#f8f9fa',
  },
  adminItem: {
    color: '#d9534f',
  },
  logoutItem: {
    borderTop: '1px solid #e9ecef',
    marginTop: '0.5rem',
    paddingTop: '0.5rem',
  },
  main: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: '2rem 0',
  },
  mainContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
  },
  footer: {
    backgroundColor: 'white',
    padding: '1.5rem 0',
    borderTop: '1px solid #e9ecef',
  },
  footerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
    color: '#6c757d',
    fontSize: '0.9rem',
  },
  footerLinks: {
    display: 'flex',
    gap: '1rem',
  },
  footerLink: {
    color: '#6c757d',
    textDecoration: 'none',
  },
};

const Layout = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [dropdownHover, setDropdownHover] = React.useState(null);
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('ログアウトに失敗しました', error);
    }
  };
  
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <div style={styles.logo}>ConnectHub</div>
          </Link>
          
          <nav style={styles.nav}>
            <Link to="/" style={styles.navItem}>ホーム</Link>
            
            {currentUser ? (
              <div style={styles.userMenu}>
                <button
                  style={styles.userButton}
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <img
                    src={currentUser.avatar_url || '/default-avatar.png'}
                    alt={currentUser.name}
                    style={styles.userAvatar}
                  />
                  <span style={styles.userName}>{currentUser.name}</span>
                  <span style={styles.userRole}>
                    {currentUser.role === 'admin' ? '(管理者)' :
                     currentUser.role === 'moderator' ? '(モデレーター)' :
                     currentUser.role === 'contributor' ? '(投稿者)' : '(閲覧者)'}
                  </span>
                </button>
                
                {dropdownOpen && (
                  <div style={styles.dropdown}>
                    <Link
                      to={`/profile/${currentUser.id}`}
                      style={{
                        ...styles.dropdownItem,
                        ...(dropdownHover === 'profile' ? styles.dropdownItemHover : {})
                      }}
                      onMouseEnter={() => setDropdownHover('profile')}
                      onMouseLeave={() => setDropdownHover(null)}
                      onClick={() => setDropdownOpen(false)}
                    >
                      プロフィール
                    </Link>
                    
                    <Link
                      to="/posts/create"
                      style={{
                        ...styles.dropdownItem,
                        ...(dropdownHover === 'create' ? styles.dropdownItemHover : {})
                      }}
                      onMouseEnter={() => setDropdownHover('create')}
                      onMouseLeave={() => setDropdownHover(null)}
                      onClick={() => setDropdownOpen(false)}
                    >
                      新規投稿
                    </Link>
                    
                    {currentUser.role === 'admin' && (
                      <>
                        <Link
                          to="/admin/users"
                          style={{
                            ...styles.dropdownItem,
                            ...styles.adminItem,
                            ...(dropdownHover === 'users' ? styles.dropdownItemHover : {})
                          }}
                          onMouseEnter={() => setDropdownHover('users')}
                          onMouseLeave={() => setDropdownHover(null)}
                          onClick={() => setDropdownOpen(false)}
                        >
                          ユーザー管理
                        </Link>
                        
                        <Link
                          to="/admin/categories"
                          style={{
                            ...styles.dropdownItem,
                            ...styles.adminItem,
                            ...(dropdownHover === 'categories' ? styles.dropdownItemHover : {})
                          }}
                          onMouseEnter={() => setDropdownHover('categories')}
                          onMouseLeave={() => setDropdownHover(null)}
                          onClick={() => setDropdownOpen(false)}
                        >
                          カテゴリ管理
                        </Link>
                      </>
                    )}
                    
                    <button
                      style={{
                        ...styles.dropdownItem,
                        ...styles.logoutItem,
                        ...(dropdownHover === 'logout' ? styles.dropdownItemHover : {}),
                        background: 'none',
                        border: 'none',
                        width: '100%',
                        textAlign: 'left',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={() => setDropdownHover('logout')}
                      onMouseLeave={() => setDropdownHover(null)}
                      onClick={handleLogout}
                    >
                      ログアウト
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" style={styles.navItem}>ログイン</Link>
                <Link to="/register" style={styles.navItem}>新規登録</Link>
              </>
            )}
          </nav>
        </div>
      </header>
      
      <main style={styles.main}>
        <div style={styles.mainContent}>
          <Outlet />
        </div>
      </main>
      
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div>&copy; {new Date().getFullYear()} ConnectHub. All rights reserved.</div>
          
          <div style={styles.footerLinks}>
            <a href="#" style={styles.footerLink}>利用規約</a>
            <a href="#" style={styles.footerLink}>プライバシーポリシー</a>
            <a href="#" style={styles.footerLink}>お問い合わせ</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
