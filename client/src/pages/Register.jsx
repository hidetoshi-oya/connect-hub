import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styles from './Auth.module.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: 'IT部' // デフォルト値
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 入力検証
    if (formData.password !== formData.confirmPassword) {
      return setError('パスワードと確認用パスワードが一致しません');
    }
    
    if (formData.password.length < 6) {
      return setError('パスワードは6文字以上で入力してください');
    }
    
    try {
      setError('');
      setIsLoading(true);
      
      // 仮の登録機能（実際にはAPIを呼び出す）
      await register(formData);
      
      // 登録成功後、ホームページにリダイレクト
      navigate('/');
    } catch (err) {
      setError('アカウント登録に失敗しました: ' + (err.message || 'エラーが発生しました'));
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.authHeader}>
          <h1 className={styles.title}>ConnectHub</h1>
          <p className={styles.subtitle}>アカウント登録</p>
        </div>
        
        {error && <div className={styles.error}>{error}</div>}
        
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="name">氏名</label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={styles.formControl}
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="email">メールアドレス</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={styles.formControl}
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="department">部署</label>
            <select
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className={styles.formControl}
              required
            >
              <option value="IT部">IT部</option>
              <option value="営業部">営業部</option>
              <option value="開発部">開発部</option>
              <option value="人事部">人事部</option>
              <option value="広報部">広報部</option>
              <option value="マーケティング部">マーケティング部</option>
            </select>
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="password">パスワード</label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={styles.formControl}
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="confirmPassword">パスワード（確認用）</label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={styles.formControl}
              required
            />
          </div>
          
          <button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? '登録中...' : '登録する'}
          </button>
        </form>
        
        <div className={styles.formFooter}>
          <p>
            すでにアカウントをお持ちの方は
            <Link to="/login" className={styles.formLink}>ログイン</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
