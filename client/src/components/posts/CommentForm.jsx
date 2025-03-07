import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import styles from './CommentForm.module.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const CommentForm = ({ postId, onCommentAdded }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      
      const response = await axios.post(
        `${API_URL}/comments/post/${postId}`, 
        { content },
        config
      );
      
      // 入力フィールドをクリア
      setContent('');
      setLoading(false);
      
      // 親コンポーネントにコメント追加を通知
      if (onCommentAdded) {
        onCommentAdded(response.data);
      }
    } catch (err) {
      console.error('コメント投稿に失敗:', err);
      setError('コメントの投稿に失敗しました');
      setLoading(false);
    }
  };
  
  return (
    <form className={styles.commentForm} onSubmit={handleSubmit}>
      <div className={styles.formContent}>
        <img 
          src={currentUser?.avatar_url || '/default-avatar.png'} 
          alt={currentUser?.name || 'ユーザー'} 
          className={styles.userAvatar} 
        />
        <input
          type="text"
          placeholder="コメントを投稿..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className={styles.commentInput}
          disabled={loading}
        />
        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={loading || !content.trim()}
        >
          {loading ? '送信中...' : '投稿'}
        </button>
      </div>
      {error && <div className={styles.error}>{error}</div>}
    </form>
  );
};

export default CommentForm;