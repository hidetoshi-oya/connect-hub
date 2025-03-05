import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

// デフォルトのアバター画像
const DEFAULT_AVATAR = '/default-avatar.png';

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
  // コメントがない場合は何も表示しない
  if (!comments || !Array.isArray(comments) || comments.length === 0) {
    return null;
  }
  
  const handleDelete = (commentId) => {
    if (window.confirm('本当にこのコメントを削除しますか？')) {
      onDeleteComment(commentId);
    }
  };
  
  return (
    <div style={styles.commentList}>
      {comments.map((comment) => {
        // コメントオブジェクトの整合性をチェック
        if (!comment || typeof comment !== 'object') {
          console.error('Invalid comment object:', comment);
          return null;
        }
        
        // コメントIDがない場合は一意のキーを生成
        const commentKey = comment.id || `comment-${Math.random().toString(36).substr(2, 9)}`;
        
        // 作成者の情報確認
        const authorName = comment.author && comment.author.name ? comment.author.name : '名前なし';
        const authorDept = comment.author && comment.author.department ? comment.author.department : '';
        const authorId = comment.author && comment.author.id ? comment.author.id : null;
        const avatarUrl = comment.author && comment.author.avatar_url ? comment.author.avatar_url : DEFAULT_AVATAR;
        
        // 日付のフォーマット (無効な日付の場合はフォールバック)
        let formattedDate = '日付なし';
        try {
          formattedDate = format(new Date(comment.created_at), 'yyyy年MM月dd日 HH:mm', { locale: ja });
        } catch (e) {
          console.error('Invalid date format:', comment.created_at);
        }
        
        // ユーザー権限チェック
        const isAuthor = currentUser && authorId === currentUser.id;
        const isAdmin = currentUser && currentUser.role === 'admin';
        const canDelete = isAuthor || isAdmin;
        
        return (
          <div key={commentKey} style={styles.commentItem}>
            <div style={styles.commentHeader}>
              <div style={styles.commentAuthor}>
                {authorId ? (
                  <Link to={`/profile/${authorId}`}>
                    <img
                      src={avatarUrl}
                      alt={authorName}
                      style={styles.authorAvatar}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = DEFAULT_AVATAR;
                      }}
                    />
                  </Link>
                ) : (
                  <img
                    src={avatarUrl}
                    alt={authorName}
                    style={styles.authorAvatar}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = DEFAULT_AVATAR;
                    }}
                  />
                )}
                <div>
                  {authorId ? (
                    <Link to={`/profile/${authorId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <span style={styles.authorName}>{authorName}</span>
                    </Link>
                  ) : (
                    <span style={styles.authorName}>{authorName}</span>
                  )}
                  <span style={styles.authorDepartment}>{authorDept}</span>
                </div>
              </div>
              
              <div style={styles.commentDate}>{formattedDate}</div>
            </div>
            
            <div style={styles.commentContent}>
              {comment.content || ''}
            </div>
            
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