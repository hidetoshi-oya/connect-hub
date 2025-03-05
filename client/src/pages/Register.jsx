import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styles from './Auth.module.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: 'IT部', // デフォルト値
    avatar_url: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileInputRef = useRef(null);
  
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // 画像のサイズチェック (最大2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError('画像サイズは2MB以下にしてください');
      return;
    }
    
    // 画像の形式チェック
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setError('JPEG、PNG、またはGIF形式の画像を選択してください');
      return;
    }
    
    // プレビュー表示用にURLを作成
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
    };
    reader.readAsDataURL(file);
    
    // 実際の実装ではここでファイルをアップロードサーバーに送信するか
    // FormDataに追加します。現在はモックのためプレビューのみ表示します。
    setFormData({
      ...formData,
      avatar_url: file // 実際のAPIではFormDataでファイルを送信
    });
  };
  
  const handleAvatarClick = () => {
    fileInputRef.current.click();
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
      
      // ここでアバター画像がある場合はアップロード処理を行う
      // 実際の実装では、avatar_urlはアップロード後のURL/パスになります
      const userData = { ...formData };
      if (avatarPreview) {
        // モックの場合は、プレビューURLをそのまま使用（実際は違う）
        userData.avatar_url = avatarPreview;
      }
      
      // 仮の登録機能（実際にはAPIを呼び出す）
      await register(userData);
      
      // 登録成功後、ホームページにリダイレクト
      navigate('/');
    } catch (err) {
      setError('アカウント登録に失敗しました: ' + (err.message || 'エラーが発生しました'));
    } finally {
      setIsLoading(false);
    }
  };
  
  const avatarStyle = {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    backgroundColor: '#e9ecef',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1rem auto',
    cursor: 'pointer',
    backgroundImage: avatarPreview ? `url(${avatarPreview})` : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    border: '2px dashed #ced4da'
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
          <div className={styles.avatarUpload}>
            <div 
              style={avatarStyle} 
              onClick={handleAvatarClick}
              title="クリックしてアバター画像をアップロード"
            >
              {!avatarPreview && <span>画像を選択</span>}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarChange}
              style={{ display: 'none' }}
              accept="image/jpeg, image/png, image/gif"
            />
          </div>
          
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