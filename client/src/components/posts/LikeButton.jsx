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
  count: {
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
  const [likeUsers, setLikeUsers] = useState([]);
  const likeCount = likes.length;
  const isLiked = currentUser && likes.some(like => like.user_id === currentUser.id);
  
  useEffect(() => {
    // モックデータ用（実際の実装ではAPIからユーザー情報を取得する）
    const mockUsers = [
      { id: 1, name: '管理者 太郎' },
      { id: 2, name: 'モデレータ 花子' },
      { id: 3, name: '山田 太郎' },
      { id: 4, name: '佐藤 健' },
      { id: 5, name: '鈴木 一郎' },
      { id: 6, name: '田中 美咲' },
      { id: 7, name: '高橋 健太' },
      { id: 8, name: '伊藤 洋子' },
      { id: 9, name: '渡辺 和也' },
      { id: 10, name: '小林 直樹' }
    ];
    
    // いいねしたユーザーの情報を取得
    const userEntities = likes.map(like => {
      return mockUsers.find(user => user.id === like.user_id) || { id: like.user_id, name: 'ユーザー' };
    });
    
    setLikeUsers(userEntities);
  }, [likes]);
  
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
  
  // いいねの表示テキストを生成
  const getLikeDisplayText = () => {
    if (likeCount === 0) {
      return 'まだいいねがありません';
    }
    
    if (likeCount === 1) {
      return `${likeUsers[0].name}がいいねしました`;
    }
    
    if (likeCount === 2) {
      return `${likeUsers[0].name}と${likeUsers[1].name}がいいねしました`;
    }
    
    if (likeCount <= 5) {
      const names = likeUsers.map(user => user.name);
      return `${names.join('、')}がいいねしました`;
    }
    
    // 5人以上の場合
    return `${likeUsers[0].name}、${likeUsers[1].name}他 ${likeCount - 2}名がいいねしました`;
  };
  
  return (
    <div style={styles.container} onClick={(e) => e.stopPropagation()}>
      <div style={styles.likeDisplay}>
        <span style={styles.icon}>👍</span>
        {getLikeDisplayText()}
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