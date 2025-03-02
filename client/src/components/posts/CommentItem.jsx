import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { ja } from 'date-fns/locale';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import styles from './CommentItem.module.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const CommentItem = ({ comment, postId, onDeleted }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  // 日付フォーマット
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true, locale: ja });
  };

  // コメント削除
  const handleDelete = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      await axios.delete(`${API_URL}/comments/${comment.id}`, config);
      
      if (onDeleted) {
        onDeleted(comment.id);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('コメントの削除に失敗:', err);
      setError('コメントの削除に失敗しました');
      setLoading(false);
    }
  };

  // 現在のユーザーがコメントの作成者かどうか
  const isCommentAuthor = currentUser && comment.author.id === currentUser.id;

  return (
    <div className={styles.commentItem}>
      <div className={styles.commentHeader}>
        <div className={styles.commentAuthor}>
          <img 
            src={comment.author.avatar_url || '/default-avatar.png'} 
            alt={comment.author.name} 
            className={styles.authorAvatar} 
          />
          <div>
            <Link to={`/profile/${comment.author.id}`} className={styles.authorName}>
              {comment.author.name}
            </Link>
            <div className={styles.authorDepartment}>{comment.author.department}</div>
          </div>
        </div>
        <div className={styles.commentMeta}>
          <div className={styles.commentDate}>{formatDate(comment.created_at)}</div>
          {isCommentAuthor && (
            <button 
              onClick={handleDelete} 
              disabled={loading}
              className={styles.deleteButton}
            >
              削除
            </button>
          )}
        </div>
      </div>
      
      <div className={styles.commentContent}>
        {comment.content}
      </div>
      
      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
};

export default CommentItem;