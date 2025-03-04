import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// スタイル - 将来的にはモジュールCSSを作成
const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    padding: '0.5rem 1rem',
    backgroundColor: '#f8f9fa',
    border: '1px solid #dee2e6',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease-in-out',
  },
  buttonActive: {
    backgroundColor: '#e9ecef',
    borderColor: '#ced4da',
  },
  icon: {
    marginRight: '0.5rem',
    fontSize: '1.25rem',
  },
  count: {
    marginLeft: '0.25rem',
    fontWeight: 'bold',
  },
  loginPrompt: {
    marginLeft: '0.5rem',
    fontSize: '0.9rem',
    color: '#6c757d',
  },
  processingOverlay: {
    opacity: 0.7,
    pointerEvents: 'none',
  }
};

const LikeButton = ({ postId, likes = [], currentUser, onUpdate }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const likeCount = likes.length;
  const isLiked = currentUser && likes.some(like => like.user_id === currentUser.id);
  
  const handleClick = async (e) => {
    // イベントの伝播を停止してリンクのクリックを防止
    e.preventDefault();
    e.stopPropagation();
    
    if (!currentUser || isProcessing) return;
    
    try {
      setIsProcessing(true);
      
      // APIを呼び出していいねを切り替える
      const response = await axios.post(`/api/posts/${postId}/like`, {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // いいねの更新完了
      setIsProcessing(false);
      
      // いいねの状態に基づいて更新
      if (response.data.liked) {
        // いいねの追加
        if (onUpdate) {
          onUpdate({
            likes: [...likes, { user_id: currentUser.id }]
          });
        }
      } else {
        // いいねの削除
        if (onUpdate) {
          onUpdate({
            likes: likes.filter(like => like.user_id !== currentUser.id)
          });
        }
      }
    } catch (err) {
      console.error('いいねの処理に失敗しました:', err);
      setIsProcessing(false);
      
      // フォールバック（オフライン対応）
      if (onUpdate) {
        if (isLiked) {
          // いいねを削除
          onUpdate({
            likes: likes.filter(like => like.user_id !== currentUser.id)
          });
        } else {
          // いいねを追加
          onUpdate({
            likes: [...likes, { user_id: currentUser.id }]
          });
        }
      }
    }
  };
  
  return (
    <div style={styles.container}>
      {currentUser ? (
        <button
          style={{
            ...styles.button,
            ...(isLiked ? styles.buttonActive : {}),
            ...(isProcessing ? styles.processingOverlay : {})
          }}
          onClick={handleClick}
        >
          <span style={styles.icon}>
            {isLiked ? '👍' : '👍'}
          </span>
          いいね
          {likeCount > 0 && <span style={styles.count}>{likeCount}</span>}
        </button>
      ) : (
        <div>
          <div style={styles.button}>
            <span style={styles.icon}>👍</span>
            いいね
            {likeCount > 0 && <span style={styles.count}>{likeCount}</span>}
          </div>
          <div style={styles.loginPrompt}>
            いいねするには<Link to="/login">ログイン</Link>してください
          </div>
        </div>
      )}
    </div>
  );
};

export default LikeButton;