import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styles from './Auth.module.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login, currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // リダイレクト先を取得（なければホームページ）
  const redirectPath = location.state?.from?.pathname || '/';

  // すでにログインしている場合は、リダイレクト先またはホームページに遷移
  useEffect(() => {
    if (currentUser) {
      navigate(redirectPath, { replace: true });
    }
  }, [currentUser, navigate, redirectPath]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 簡易バリデーション
    if (!email || !password) {
      setError('メールアドレスとパスワードを入力してください');
      return;
    }
    
    try {
      setError('');
      setLoading(true);
      
      // ログイン処理
      await login(email, password);
      
      // ログイン成功後の処理はuseEffectで行われる
    } catch (err) {
      console.error('ログインエラー:', err);
      setError(err.response?.data?.message || 'ログインに失敗しました');
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.authHeader}>
          <h1 className={styles.title}>ConnectHub</h1>
          <p className={styles.subtitle}>社内のつながりを育む</p>
        </div>
        
        <h2 className={styles.formTitle}>ログイン</h2>
        
        {location.state?.from && (
          <div className={styles.redirectInfo}>
            このページにアクセスするにはログインが必要です
          </div>
        )}
        
        {error && <div className={styles.error}>{error}</div>}
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="email">メールアドレス</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="company@example.com"
              required
              disabled={loading}
              className={styles.formControl}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="password">パスワード</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              required
              disabled={loading}
              className={styles.formControl}
            />
          </div>
          
          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? 'ログイン中...' : 'ログイン'}
          </button>
        </form>
        
        <div className={styles.formFooter}>
          <p>
            アカウントをお持ちでない方は <Link to="/register" className={styles.formLink}>新規登録</Link>
          </p>
          
          <div className={styles.testCredentials}>
            <h3>テストアカウント</h3>
            <p>管理者: admin@example.com / password</p>
            <p>一般ユーザー: yamada@example.com / password</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;