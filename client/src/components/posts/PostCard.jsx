import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { ja } from 'date-fns/locale';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem';
import styles from './PostCard.module.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const PostCard = ({ post, onUpdate }) => {
  const [showComments, setShowComments] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { currentUser, isAuthenticated } = useAuth();

  // 日付フォーマット
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true, locale: ja });
  };

  // いいね機能
  const handleLike = async () => {
    if (!isAuthenticated) {
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const response = await axios.patch(`${API_URL}/posts/${post.id}/like`, {}, config);
      
      // 投稿の更新を親コンポーネントに通知
      if (onUpdate) {
        onUpdate(post.id, { likes: response.data.likes });
      }
      
      setLoading(false);
    } catch (err) {
      console.error('いいねの処理に失敗:', err);
      setError('いいねの処理に失敗しました');
      setLoading(false);
    }
  };

  // コメント追加後のコールバック
  const handleCommentAdded = (newComment) => {
    if (onUpdate) {
      const updatedComments = [...post.comments, newComment];
      onUpdate(post.id, { comments: updatedComments });
    }
  };

  // コメント削除後のコールバック
  const handleCommentDeleted = (commentId) => {
    if (onUpdate) {
      const updatedComments = post.comments.filter(comment => comment.id !== commentId);
      onUpdate(post.id, { comments: updatedComments });
    }
  };

  // ユーザーがこの投稿にいいねしているか確認
  const hasLiked = post.likes?.some(like => like.user_id === currentUser?.id);

  return (
    <div className={`${styles.postCard} ${post.isPinned ? styles.pinnedPost : ''}`}>
      {post.isPinned && (
        <div className={styles.pinnedBadge}>ピン留め</div>
      )}

      <div className={styles.postHeader}>
        <div className={styles.authorInfo}>
          <img 
            src={post.author.avatar_url || '/default-avatar.png'} 
            alt={post.author.name}
            className={styles.authorAvatar} 
          />
          <div>
            <Link to={`/profile/${post.author.id}`} className={styles.authorName}>
              {post.author.name}
            </Link>
            <div className={styles.authorDepartment}>{post.author.department}</div>
          </div>
        </div>
        <div className={styles.postMeta}>
          <div className={styles.postDate}>{formatDate(post.created_at)}</div>
        </div>
      </div>

      <Link to={`/posts/${post.id}`} className={styles.postTitle}>
        <h3>{post.title}</h3>
      </Link>

      <div className={styles.postContent}>
        {/* 長い文章は省略して表示 */}
        {post.content.length > 300
          ? `${post.content.substring(0, 300)}...`
          : post.content}
      </div>

      {post.categories?.length > 0 && (
        <div className={styles.categoryTags}>
          {post.categories.map(category => (
            <Link 
              key={category.name} 
              to={`/?category=${encodeURIComponent(category.name)}`}
              className={styles.categoryTag}
            >
              {category.name}
            </Link>
          ))}
        </div>
      )}

      <div className={styles.postActions}>
        <button 
          className={`${styles.actionButton} ${hasLiked ? styles.liked : ''}`} 
          onClick={handleLike}
          disabled={loading || !isAuthenticated}
        >
          <span className={styles.icon}>👍</span>
          いいね
          <span className={styles.count}>{post.likes?.length || 0}</span>
        </button>

        <button 
          className={`${styles.actionButton} ${showComments ? styles.active : ''}`} 
          onClick={() => setShowComments(!showComments)}
        >
          <span className={styles.icon}>💬</span>
          コメント
          <span className={styles.count}>{post.comments?.length || 0}</span>
        </button>

        <Link to={`/posts/${post.id}`} className={styles.actionButton}>
          <span className={styles.icon}>👁️</span>
          詳細を見る
        </Link>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {showComments && (
        <div className={styles.commentsSection}>
          {post.comments?.length > 0 ? (
            <div className={styles.commentsList}>
              {post.comments.map(comment => (
                <CommentItem 
                  key={comment.id} 
                  comment={comment}
                  postId={post.id}
                  onDeleted={handleCommentDeleted}
                />
              ))}
            </div>
          ) : (
            <div className={styles.noComments}>コメントはまだありません</div>
          )}

          {isAuthenticated && (
            <CommentForm 
              postId={post.id} 
              onCommentAdded={handleCommentAdded}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default PostCard;