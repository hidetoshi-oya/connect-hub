import React from 'react';
import { Link } from 'react-router-dom';

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
};

const LikeButton = ({ likes, currentUser, onLike }) => {
  const likeCount = likes.length;
  const isLiked = currentUser && likes.some(like => like.user_id === currentUser.id);
  
  const handleClick = () => {
    if (currentUser) {
      onLike();
    }
  };
  
  return (
    <div style={styles.container}>
      {currentUser ? (
        <button
          style={{
            ...styles.button,
            ...(isLiked ? styles.buttonActive : {})
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
