import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import PostForm from '../components/posts/PostForm';
import Loading from '../components/ui/Loading';
import styles from './CreatePost.module.css';

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        
        // APIから投稿データを取得
        const response = await axios.get(`/api/posts/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        setPost(response.data);
        
        // 権限チェック（投稿者または管理者のみ編集可能）
        if (currentUser && currentUser.id !== response.data.author.id && currentUser.role !== 'admin') {
          navigate('/');
        }
      } catch (err) {
        console.error('投稿の取得に失敗しました', err);
        setError('投稿の取得に失敗しました。もう一度お試しください。');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPost();
  }, [id, currentUser, navigate]);
  
  const handleSubmit = async (formData) => {
    // ヘッダー画像の変数をスコープの外で宣言
    let headerImageUrl = formData.headerImage;
    
    try {
      setSubmitting(true);
      setError('');
      
      // ヘッダー画像が File オブジェクトの場合はアップロード処理を行う
      if (formData.headerImageFile) {
        const imageFormData = new FormData();
        imageFormData.append('file', formData.headerImageFile);
        
        // 実際の環境ではこのようにファイルをアップロードします
        // const uploadResponse = await axios.post('/api/upload', imageFormData);
        // headerImageUrl = uploadResponse.data.url;
      }
      
      // APIを使って投稿データを更新
      const response = await axios.put(`/api/posts/${id}`, {
        title: formData.title,
        content: formData.content,
        headerImage: headerImageUrl,
        categories: formData.categories,
        isPinned: formData.isPinned || false
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // 成功メッセージを表示
      setSuccess('投稿が更新されました');
      
      // 3秒後に投稿詳細ページにリダイレクト
      setTimeout(() => {
        navigate(`/posts/${id}`);
      }, 3000);
    } catch (err) {
      console.error('投稿の更新に失敗しました', err);
      
      if (err.response) {
        setError(err.response.data.message || '投稿の更新に失敗しました。再度お試しください。');
      } else if (err.request) {
        setError('サーバーに接続できませんでした。インターネット接続を確認してください。');
      } else {
        setError('リクエストの送信中にエラーが発生しました。');
      }
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleCancel = () => {
    navigate(`/posts/${id}`);
  };
  
  if (loading) return <Loading />;
  
  if (!post) return (
    <div className="container">
      <div className={styles.createPostPage}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>投稿の編集</h1>
          <Link to="/" className={styles.backButton}>← ホームに戻る</Link>
        </div>
        <div className={styles.errorMessage}>
          {error || '投稿が見つかりません。削除された可能性があります。'}
        </div>
      </div>
    </div>
  );
  
  return (
    <div className="container">
      <div className={styles.createPostPage}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>投稿の編集</h1>
          <Link to={`/posts/${id}`} className={styles.backButton}>
            ← 投稿に戻る
          </Link>
        </div>
        
        {error && <div className={styles.errorMessage}>{error}</div>}
        {success && <div className={styles.successMessage}>{success}</div>}
        
        <div className={styles.formContainer}>
          <div className={styles.formHeader}>
            <h2 className={styles.formTitle}>投稿内容を編集</h2>
            <p className={styles.formDescription}>
              社内報に表示される内容です。適切なカテゴリを選択してください。
            </p>
          </div>
          
          <div className={styles.divider}></div>
          
          <PostForm
            initialValues={{
              title: post.title,
              content: post.content,
              headerImage: post.headerImage,
              categories: post.categories.map(category => category.name),
              isPinned: post.isPinned
            }}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={submitting}
            isEdit={true}
          />
        </div>
      </div>
    </div>
  );
};

export default EditPost;