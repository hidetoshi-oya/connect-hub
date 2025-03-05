import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

// スタイル - 将来的にはモジュールCSSを作成
const styles = {
  form: {
    marginBottom: '2rem',
  },
  textarea: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #dee2e6',
    borderRadius: '4px',
    resize: 'vertical',
    minHeight: '100px',
    marginBottom: '0.5rem',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    padding: '0.5rem 1rem',
    backgroundColor: '#4a90e2',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  buttonDisabled: {
    backgroundColor: '#b0c4de',
    cursor: 'not-allowed',
  },
  error: {
    color: '#d9534f',
    marginBottom: '0.5rem',
  },
};

const CommentForm = ({ postId, onAddComment }) => {
  const { currentUser } = useAuth();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError('コメントを入力してください。');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError('');
      
      // 文字列のみを渡してコメントを追加
      // 実際のコメントオブジェクトの作成は親コンポーネントで行う
      const result = await onAddComment(content.trim());
      
      if (result) {
        // コメント追加成功
        setContent(''); // フォームをリセット
      }
    } catch (err) {
      console.error('コメントの投稿に失敗しました', err);
      setError('コメントの投稿に失敗しました。もう一度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form style={styles.form} onSubmit={handleSubmit}>
      {error && <div style={styles.error}>{error}</div>}
      
      <textarea
        placeholder="コメントを入力してください"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        style={styles.textarea}
        disabled={isSubmitting}
      />
      
      <div style={styles.buttonContainer}>
        <button
          type="submit"
          style={{
            ...styles.button,
            ...(isSubmitting ? styles.buttonDisabled : {})
          }}
          disabled={isSubmitting}
        >
          {isSubmitting ? '送信中...' : 'コメントを投稿'}
        </button>
      </div>
    </form>
  );
};

export default CommentForm;