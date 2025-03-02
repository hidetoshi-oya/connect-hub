import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import styles from './PostForm.module.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const PostForm = ({ post, mode = 'create' }) => {
  const [title, setTitle] = useState(post?.title || '');
  const [content, setContent] = useState(post?.content || '');
  const [selectedCategories, setSelectedCategories] = useState(post?.categories?.map(c => c.name) || []);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // カテゴリ一覧の取得
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_URL}/categories`);
        setAvailableCategories(response.data);
      } catch (err) {
        console.error('カテゴリの取得に失敗:', err);
        setError('カテゴリの読み込みに失敗しました');
      }
    };

    fetchCategories();
  }, []);

  // フォーム送信処理
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      setError('タイトルと内容は必須です');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      
      const postData = {
        title,
        content,
        categories: selectedCategories
      };
      
      let response;
      
      if (mode === 'create') {
        // 新規投稿
        response = await axios.post(`${API_URL}/posts`, postData, config);
      } else {
        // 投稿の更新
        response = await axios.put(`${API_URL}/posts/${post.id}`, postData, config);
      }
      
      setLoading(false);
      setSuccess(true);
      
      // 投稿詳細ページへリダイレクト
      setTimeout(() => {
        navigate(`/posts/${response.data.id}`);
      }, 1500);
    } catch (err) {
      console.error('投稿の送信に失敗:', err);
      setError(err.response?.data?.message || '投稿の送信に失敗しました');
      setLoading(false);
    }
  };

  // カテゴリの選択/解除
  const toggleCategory = (categoryName) => {
    if (selectedCategories.includes(categoryName)) {
      setSelectedCategories(selectedCategories.filter(c => c !== categoryName));
    } else {
      setSelectedCategories([...selectedCategories, categoryName]);
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.formTitle}>
        {mode === 'create' ? '新規投稿を作成' : '投稿を編集'}
      </h2>
      
      <form className={styles.postForm} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="title" className={styles.label}>タイトル</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="タイトルを入力してください"
            className={styles.input}
            disabled={loading}
            required
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="content" className={styles.label}>内容</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="投稿内容を入力してください"
            className={styles.textarea}
            rows="10"
            disabled={loading}
            required
          ></textarea>
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.label}>カテゴリ</label>
          <div className={styles.categoriesContainer}>
            {availableCategories.map(category => (
              <div key={category.id} className={styles.categoryItem}>
                <label className={styles.categoryLabel}>
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category.name)}
                    onChange={() => toggleCategory(category.name)}
                    disabled={loading}
                    className={styles.categoryCheckbox}
                  />
                  <span className={styles.categoryName}>{category.name}</span>
                </label>
              </div>
            ))}
          </div>
        </div>
        
        {error && <div className={styles.errorMessage}>{error}</div>}
        {success && <div className={styles.successMessage}>投稿が成功しました！リダイレクトします...</div>}
        
        <div className={styles.formActions}>
          <button 
            type="button" 
            onClick={() => navigate(-1)}
            className={styles.cancelButton}
            disabled={loading}
          >
            キャンセル
          </button>
          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? '送信中...' : mode === 'create' ? '投稿する' : '更新する'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostForm;