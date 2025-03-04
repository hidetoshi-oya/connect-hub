import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import axios from 'axios';

// コンポーネント
import CommentForm from '../components/comments/CommentForm';
import CommentList from '../components/comments/CommentList';
import LikeButton from '../components/posts/LikeButton';
import Loading from '../components/ui/Loading';

// スタイル - 将来的にはモジュールCSSを作成
const styles = {
  container: {
    padding: '2rem 0',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '2rem',
  },
  title: {
    fontSize: '2rem',
    marginTop: 0,
    marginBottom: '0.5rem',
  },
  meta: {
    display: 'flex',
    alignItems: 'center',
    color: '#6c757d',
    fontSize: '0.9rem',
    marginBottom: '1rem',
  },
  author: {
    display: 'flex',
    alignItems: 'center',
    marginRight: '1rem',
  },
  authorAvatar: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    marginRight: '0.5rem',
  },
  date: {
    marginRight: '1rem',
  },
  categories: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '1rem',
  },
  category: {
    backgroundColor: '#e9ecef',
    color: '#212529',
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    fontSize: '0.8rem',
  },
  content: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
    marginBottom: '2rem',
    whiteSpace: 'pre-wrap',
  },
  actions: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '2rem',
  },
  postActions: {
    display: 'flex',
    gap: '1rem',
  },
  editButton: {
    display: 'inline-flex',
    alignItems: 'center',
    color: '#4a90e2',
    textDecoration: 'none',
    fontSize: '0.9rem',
  },
  deleteButton: {
    display: 'inline-flex',
    alignItems: 'center',
    color: '#d9534f',
    backgroundColor: 'transparent',
    border: 'none',
    padding: 0,
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  backLink: {
    display: 'inline-flex',
    alignItems: 'center',
    color: '#4a90e2',
    textDecoration: 'none',
  },
  commentsContainer: {
    marginTop: '2rem',
  },
  commentsHeader: {
    fontSize: '1.5rem',
    marginBottom: '1rem',
  },
  noCommentsText: {
    color: '#6c757d',
    textAlign: 'center',
    padding: '1rem',
  },
};

const PostDetail = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/posts/${id}`);
        setPost(response.data);
      } catch (err) {
        console.error('投稿の取得に失敗しました', err);
        setError('投稿の取得に失敗しました。もう一度お試しください。');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPost();
  }, [id]);
  
  const handleLike = async () => {
    try {
      // 実際はAPIを呼び出してデータを更新する
      // この例ではクライアント側だけで疑似的に更新
      const likedByCurrentUser = post.likes.some(like => like.user_id === currentUser.id);
      
      if (likedByCurrentUser) {
        // いいねの取り消し
        setPost({
          ...post,
          likes: post.likes.filter(like => like.user_id !== currentUser.id)
        });
      } else {
        // いいねの追加
        setPost({
          ...post,
          likes: [...post.likes, { user_id: currentUser.id }]
        });
      }
    } catch (err) {
      console.error('いいねの更新に失敗しました', err);
    }
  };
  
  const handleDelete = async () => {
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      return;
    }
    
    try {
      // 実際はAPIを呼び出して投稿を削除する
      // await axios.delete(`/api/posts/${id}`);
      
      // 削除成功後、ホームページにリダイレクト
      navigate('/');
    } catch (err) {
      console.error('投稿の削除に失敗しました', err);
      setError('投稿の削除に失敗しました。もう一度お試しください。');
    }
  };
  
  const handleAddComment = (newComment) => {
    // 新しいコメントを投稿に追加
    setPost({
      ...post,
      comments: [...post.comments, newComment]
    });
  };
  
  if (loading) return <Loading />;
  
  if (error) {
    return (
      <div className="container" style={styles.container}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>{error}</p>
          <Link to="/" style={styles.backLink}>
            ← ホームに戻る
          </Link>
        </div>
      </div>
    );
  }
  
  if (!post) return null;
  
  const isAuthor = currentUser && post.author.id === currentUser.id;
  const isAdmin = currentUser && currentUser.role === 'admin';
  const canEdit = isAuthor || isAdmin;
  
  return (
    <div className="container" style={styles.container}>
      <div style={styles.header}>
        <div>
          <Link to="/" style={styles.backLink}>
            ← ホームに戻る
          </Link>
          <h1 style={styles.title}>{post.title}</h1>
          <div style={styles.meta}>
            <div style={styles.author}>
              <img
                src={post.author.avatar_url || '/default-avatar.png'}
                alt={post.author.name}
                style={styles.authorAvatar}
              />
              <span>{post.author.name} ({post.author.department})</span>
            </div>
            <div style={styles.date}>
              {format(new Date(post.created_at), 'yyyy年MM月dd日 HH:mm', { locale: ja })}
            </div>
          </div>
          <div style={styles.categories}>
            {post.categories.map((category, index) => (
              <span key={index} style={styles.category}>
                {category.name}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      <div style={styles.content}>
        {post.content.split('\\n').map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </div>
      
      <div style={styles.actions}>
        <LikeButton
          likes={post.likes}
          currentUser={currentUser}
          onLike={handleLike}
        />
        
        {canEdit && (
          <div style={styles.postActions}>
            <Link to={`/posts/edit/${post.id}`} style={styles.editButton}>
              編集
            </Link>
            <button
              onClick={handleDelete}
              style={styles.deleteButton}
            >
              {deleteConfirm ? '削除を確認' : '削除'}
            </button>
          </div>
        )}
      </div>
      
      <div style={styles.commentsContainer}>
        <h2 style={styles.commentsHeader}>コメント ({post.comments.length})</h2>
        
        {currentUser ? (
          <CommentForm postId={post.id} onAddComment={handleAddComment} />
        ) : (
          <p style={{ marginBottom: '1rem' }}>
            コメントを投稿するには<Link to="/login">ログイン</Link>してください
          </p>
        )}
        
        {post.comments.length > 0 ? (
          <CommentList comments={post.comments} currentUser={currentUser} />
        ) : (
          <p style={styles.noCommentsText}>
            コメントはまだありません。最初のコメントを投稿しましょう。
          </p>
        )}
      </div>
    </div>
  );
};

export default PostDetail;
