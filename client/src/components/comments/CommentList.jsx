import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

// スタイル - 将来的にはモジュールCSSを作成
const styles = {
  commentList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  commentItem: {
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    padding: '1rem',
  },
  commentHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.5rem',
  },
  commentAuthor: {
    display: 'flex',
    alignItems: 'center',
  },
  authorAvatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    marginRight: '0.5rem',
  },
  authorName: {
    fontWeight: 'bold',
    marginRight: '0.5rem',
  },
  authorDepartment: {
    color: '#6c757d',
    fontSize: '0.8rem',
  },
  commentDate: {
    color: '#6c757d',
    fontSize: '0.9rem',
  },
  commentContent: {
    whiteSpace: 'pre-wrap',
    marginBottom: '0.5rem',
  },
  commentActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '0.5rem',
  },
  actionButton: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#6c757d',
    cursor: 'pointer',
    fontSize: '0.9rem',
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
  },
  deleteButton: {
    color: '#d9534f',
  },
};

const CommentList = ({ comments, currentUser, onDeleteComment }) => {
  const handleDelete = (commentId) => {
    if (window.confirm('本当にこのコメントを削除しますか？')) {
      onDeleteComment(commentId);
    }
  };
  
  return (
    <div style={styles.commentList}>
      {comments.map((comment) => {
        const isAuthor = currentUser && comment.author.id === currentUser.id;
        const isAdmin = currentUser && currentUser.role === 'admin';
        const canDelete = isAuthor || isAdmin;
        
        const formattedDate = format(new Date(comment.created_at), 'yyyy年MM月dd日 HH:mm', { locale: ja });
        
        return (
          <div key={comment.id} style={styles.commentItem}>
            <div style={styles.commentHeader}>
              <div style={styles.commentAuthor}>
                <Link to={`/profile/${comment.author.id}`}>
                  <img
                    src={comment.author.avatar_url || '/default-avatar.png'}
                    alt={comment.author.name}
                    style={styles.authorAvatar}
                  />
                </Link>
                <div>
                  <Link to={`/profile/${comment.author.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <span style={styles.authorName}>{comment.author.name}</span>
                  </Link>
                  <span style={styles.authorDepartment}>{comment.author.department}</span>
                </div>
              </div>
              
              <div style={styles.commentDate}>{formattedDate}</div>
            </div>
            
            <div style={styles.commentContent}>{comment.content}</div>
            
            {canDelete && (
              <div style={styles.commentActions}>
                <button
                  style={{ ...styles.actionButton, ...styles.deleteButton }}
                  onClick={() => handleDelete(comment.id)}
                >
                  削除
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CommentList;
