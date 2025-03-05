import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

// スタイル - 将来的にはモジュールCSSを作成
const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
  },
  likeButton: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    padding: '4px 8px',
    borderRadius: '4px',
    transition: 'background-color 0.2s ease-in-out',
  },
  likeButtonActive: {
    backgroundColor: '#e6f3ff', // 薄い水色の背景
  },
  icon: {
    marginRight: '0.25rem',
    fontSize: '1rem',
  },
  likeCount: {
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
  },
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
      {currentUser ? (
        <div
          style={{
            ...styles.likeButton,
            ...(isLiked ? styles.likeButtonActive : {}),
            ...(isProcessing ? styles.processingOverlay : {})
          }}
          onClick={handleClick}
          title={isLiked ? 'いいねを取り消す' : 'いいねする'}
        >
          <span style={styles.icon}>👍</span>
          <span style={styles.likeCount}>{likeCount}</span>
        </div>
      ) : (
        <div style={styles.container}>
          <div style={styles.likeButton}>
            <span style={styles.icon}>👍</span>
            <span style={styles.likeCount}>{likeCount}</span>
          </div>
          <div style={styles.loginPrompt}>
            <Link to="/login">ログイン</Link>でいいね
          </div>
        </div>
      )}
    </div>
  );
};

export default LikeButton;