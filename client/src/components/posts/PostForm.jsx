import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import styles from './PostForm.module.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const PostForm = ({ post, isEdit = false }) => {
  const [title, setTitle] = useState(post?.title || '');
  const [content, setContent] = useState(post?.content || '');
  const [selectedCategories, setSelectedCategories] = useState(post?.categories?.map(c => c.name) || []);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // カテゴリ一覧を取得
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

  // カテゴリの選択/解除
  const toggleCategory = (categoryName) => {
    if (selectedCategories.includes(categoryName)) {
      setSelectedCategories(selectedCategories.filter(c => c !== categoryName));
    } else {
      setSelectedCategories([...selectedCategories, categoryName]);
    }
  };

  // フォーム送信
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 入力検証
    if (!title.trim() || !content.trim()) {
      setError('タイトルと本文は必須です');
      return;
    }

    if (selectedCategories.length === 0) {
      setError('少なくとも1つのカテゴリを選択してください');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

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

      if (isEdit && post) {
        // 投稿の更新
        response = await axios.put(`${API_URL}/posts/${post.id}`, postData, config);
        setSuccess('投稿を更新しました');
      } else {
        // 新規投稿
        response = await axios.post(`${API_URL}/posts`, postData, config);
        setSuccess('投稿を作成しました');
        
        // フォームをリセット（新規投稿の場合のみ）
        setTitle('');
        setContent('');
        setSelectedCategories([]);
      }

      setLoading(false);

      // 成功メッセージを表示して、少し待ってから詳細ページに遷移
      setTimeout(() => {
        navigate(`/posts/${response.data.id}`);
      }, 1500);
    } catch (err) {
      console.error('投稿の保存に失敗:', err);
      setError(err.response?.data?.message || '投稿の保存に失敗しました');
      setLoading(false);
    }
  };

  return (
    <form className={styles.postForm} onSubmit={handleSubmit}>
      <h2 className={styles.formTitle}>{isEdit ? '投稿を編集' : '新規投稿'}</h2>

      <div className={styles.formGroup}>
        <label htmlFor="title" className={styles.label}>タイトル</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="タイトルを入力してください"
          className={styles.titleInput}
          disabled={loading}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="content" className={styles.label}>本文</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="本文を入力してください"
          className={styles.contentInput}
          rows={10}
          disabled={loading}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>カテゴリ</label>
        <div className={styles.categoriesContainer}>
          {availableCategories.map(category => (
            <div key={category.id} className={styles.categoryItem}>
              <input
                type="checkbox"
                id={`category-${category.id}`}
                checked={selectedCategories.includes(category.name)}
                onChange={() => toggleCategory(category.name)}
                disabled={loading}
              />
              <label htmlFor={`category-${category.id}`} className={styles.categoryLabel}>
                {category.name}
              </label>
            </div>
          ))}
        </div>
      </div>

      {error && <div className={styles.error}>{error}</div>}
      {success && <div className={styles.success}>{success}</div>}

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
          {loading ? '保存中...' : isEdit ? '更新する' : '投稿する'}
        </button>
      </div>
    </form>
  );
};

export default PostForm;