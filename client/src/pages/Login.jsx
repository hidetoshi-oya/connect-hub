import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styles from './Login.module.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // リダイレクト元がある場合はその場所へ、なければホームへ
  const redirectPath = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      setError('メールアドレスとパスワードを入力してください');
      return;
    }
    
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      
      // ログイン成功後、リダイレクト
      navigate(redirectPath);
    } catch (err) {
      setError('ログインに失敗しました。メールアドレスとパスワードを確認してください。');
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginContainer}>
        <div className={styles.loginHeader}>
          <h1 className={styles.logoText}>ConnectHub</h1>
          <p className={styles.tagline}>社内のつながりを育む</p>
        </div>
        
        <div className={styles.formContainer}>
          <h2 className={styles.formTitle}>ログイン</h2>
          
          {error && <div className={styles.error}>{error}</div>}
          
          <form className={styles.loginForm} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>メールアドレス</label>
              <input 
                type="email" 
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
                required
                disabled={loading}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.label}>パスワード</label>
              <input 
                type="password" 
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
                required
                disabled={loading}
              />
            </div>
            
            <button 
              type="submit" 
              className={styles.loginButton}
              disabled={loading}
            >
              {loading ? 'ログイン中...' : 'ログイン'}
            </button>
          </form>
          
          <div className={styles.formFooter}>
            <p>
              アカウントをお持ちでない方は
              <Link to="/register" className={styles.registerLink}>
                こちらから登録
              </Link>
            </p>
          </div>
        </div>
        
        <div className={styles.demoAccounts}>
          <h3>テストアカウント</h3>
          <div className={styles.accountList}>
            <div className={styles.accountItem}>
              <strong>管理者:</strong> admin@example.com / password
            </div>
            <div className={styles.accountItem}>
              <strong>モデレーター:</strong> moderator@example.com / password
            </div>
            <div className={styles.accountItem}>
              <strong>投稿者:</strong> yamada@example.com / password
            </div>
            <div className={styles.accountItem}>
              <strong>一般ユーザー:</strong> suzuki@example.com / password
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;