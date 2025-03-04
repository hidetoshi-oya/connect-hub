import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import styles from './PostForm.module.css';

const PostForm = ({ initialValues = {}, onSubmit, onCancel, isSubmitting = false, isEdit = false }) => {
  const { currentUser } = useAuth();
  
  const [title, setTitle] = useState(initialValues.title || '');
  const [content, setContent] = useState(initialValues.content || '');
  const [selectedCategories, setSelectedCategories] = useState(initialValues.categories || []);
  const [isPinned, setIsPinned] = useState(initialValues.isPinned || false);
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // 実際はAPIを呼び出してカテゴリリストを取得する
        // const response = await axios.get('/api/categories');
        
        // モックデータ
        const mockCategories = [
          { id: 1, name: 'お知らせ', description: '会社からの公式なお知らせや通知を掲載します', is_active: true },
          { id: 2, name: 'プロジェクト', description: '社内の各種プロジェクトに関する情報を共有します', is_active: true },
          { id: 3, name: '社員インタビュー', description: '社員の仕事や趣味などを紹介するインタビュー記事です', is_active: true },
          { id: 4, name: 'イベント', description: '社内イベントや外部イベントの情報を掲載します', is_active: true },
          { id: 5, name: '社内システム', description: '業務システムや社内ツールに関する情報です', is_active: true },
          { id: 6, name: '募集', description: '社内での募集やプロジェクトメンバー募集などの情報です', is_active: true },
          { id: 7, name: 'マーケティング部', description: 'マーケティング部からの情報発信です', is_active: true },
          { id: 8, name: '営業部', description: '営業部からの情報発信です', is_active: true },
          { id: 9, name: '開発部', description: '開発部からの情報発信です', is_active: true },
          { id: 10, name: '人事部', description: '人事部からの情報発信です', is_active: true },
          { id: 11, name: '広報部', description: '広報部からの情報発信です', is_active: true },
          { id: 12, name: 'IT部', description: 'IT部からの情報発信です', is_active: true }
        ];
        
        setCategories(mockCategories);
      } catch (err) {
        console.error('カテゴリの取得に失敗しました', err);
      }
    };
    
    fetchCategories();
  }, []);
  
  const handleCategoryChange = (categoryName) => {
    if (selectedCategories.includes(categoryName)) {
      setSelectedCategories(selectedCategories.filter(cat => cat !== categoryName));
    } else {
      setSelectedCategories([...selectedCategories, categoryName]);
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (title.trim() === '') {
      newErrors.title = 'タイトルを入力してください';
    } else if (title.length > 100) {
      newErrors.title = 'タイトルは100文字以内で入力してください';
    }
    
    if (content.trim() === '') {
      newErrors.content = '内容を入力してください';
    }
    
    if (selectedCategories.length === 0) {
      newErrors.categories = 'カテゴリを1つ以上選択してください';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    onSubmit({
      title,
      content,
      categories: selectedCategories,
      isPinned
    });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label className={styles.formLabel} htmlFor="title">タイトル</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={styles.formControl}
          placeholder="投稿のタイトル"
          disabled={isSubmitting}
        />
        {errors.title && <div className={styles.error}>{errors.title}</div>}
      </div>
      
      <div className={styles.formGroup}>
        <label className={styles.formLabel} htmlFor="content">内容</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className={`${styles.formControl} ${styles.textArea}`}
          placeholder="投稿の内容"
          rows="10"
          disabled={isSubmitting}
        ></textarea>
        {errors.content && <div className={styles.error}>{errors.content}</div>}
      </div>
      
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>カテゴリ</label>
        <div className={styles.checkboxGroup}>
          {categories.map((category) => (
            <div key={category.id} className={styles.checkbox}>
              <input
                type="checkbox"
                id={`category-${category.id}`}
                value={category.name}
                checked={selectedCategories.includes(category.name)}
                onChange={() => handleCategoryChange(category.name)}
                disabled={isSubmitting}
              />
              <label htmlFor={`category-${category.id}`}>{category.name}</label>
            </div>
          ))}
        </div>
        {errors.categories && <div className={styles.error}>{errors.categories}</div>}
      </div>
      
      {(currentUser?.role === 'admin' || currentUser?.role === 'moderator') && (
        <div className={styles.formGroup}>
          <div className={styles.checkbox}>
            <input
              type="checkbox"
              id="isPinned"
              checked={isPinned}
              onChange={(e) => setIsPinned(e.target.checked)}
              disabled={isSubmitting}
            />
            <label htmlFor="isPinned">トップに固定する</label>
          </div>
        </div>
      )}
      
      <div className={styles.buttonContainer}>
        <button
          type="button"
          onClick={onCancel}
          className={`${styles.button} ${styles.secondaryButton}`}
          disabled={isSubmitting}
        >
          キャンセル
        </button>
        
        <button
          type="submit"
          className={`${styles.button} ${styles.primaryButton}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? '送信中...' : isEdit ? '更新する' : '投稿する'}
        </button>
      </div>
    </form>
  );
};

export default PostForm;
