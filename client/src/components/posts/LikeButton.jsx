import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

// スタイル - 将来的にはモジュールCSSを作成
const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
  },
  likeText: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'color 0.2s ease-in-out',
    color: '#6c757d',
  },
  likeTextActive: {
    color: '#0d6efd',
    fontWeight: 'bold',
  },
  icon: {
    marginRight: '0.5rem',
    fontSize: '1rem',
  },
  likeCount: {
    fontWeight: 'bold',
    marginLeft: '0.25rem',
  },
  loginPrompt: {
    marginLeft: '0.5rem',
    fontSize: '0.9rem',
    color: '#6c757d',
  },
  processingOverlay: {
    opacity: 0.7,
    pointerEvents: 'none',
  },
  likeDisplay: {
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    marginRight: '0.5rem',
  }
};

const LikeButton = ({ postId, likes = [], currentUser, onUpdate }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const likeCount = Array.isArray(likes) ? likes.length : 0;
  const isLiked = currentUser && Array.isArray(likes) && likes.some(like => like.user_id === currentUser.id);
  
  const handleClick = async (e) => {
    // イベントの伝播を停止してリンクのクリックを防止
    e.preventDefault();
    e.stopPropagation();
    
    if (!currentUser || isProcessing) return;
    
    try {
      setIsProcessing(true);
      
      // APIを呼び出していいねを切り替える
      const response = await api.post(`/posts/${postId}/like`);
      
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
    <div style={styles.container} onClick={(e) => e.stopPropagation()}>
      <div style={styles.likeDisplay}>
        <span style={styles.icon}>👍</span>
        <span style={styles.likeCount}>{likeCount}</span>
      </div>
      
      {currentUser ? (
        <div
          style={{
            ...styles.likeText,
            ...(isLiked ? styles.likeTextActive : {}),
            ...(isProcessing ? styles.processingOverlay : {})
          }}
          onClick={handleClick}
        >
          {isLiked ? 'いいね済み' : 'いいねする'}
        </div>
      ) : (
        <div style={styles.loginPrompt}>
          いいねするには<Link to="/login">ログイン</Link>してください
        </div>
      )}
    </div>
  );
};

export default LikeButton;