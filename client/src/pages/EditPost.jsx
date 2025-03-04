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
        const response = await axios.get(`/api/posts/${id}`);
        setPost(response.data);
        
        // 権限チェック - 自分の投稿または管理者でない場合はリダイレクト
        if (currentUser.id !== response.data.author.id && currentUser.role !== 'admin') {
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
    try {
      setSubmitting(true);
      setError('');
      
      // 実際はAPIを呼び出して投稿を更新する
      // const response = await axios.put(`/api/posts/${id}`, formData);
      
      // 成功メッセージを表示
      setSuccess('投稿が更新されました');
      
      // 3秒後に投稿詳細ページにリダイレクト
      setTimeout(() => {
        navigate(`/posts/${id}`);
      }, 3000);
    } catch (err) {
      console.error('投稿の更新に失敗しました', err);
      setError('投稿の更新に失敗しました。もう一度お試しください。');
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleCancel = () => {
    navigate(`/posts/${id}`);
  };
  
  if (loading) return <Loading />;
  
  if (!post) return null;
  
  return (
    <div className="container">
      <div className={styles.createPostContainer}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>投稿の編集</h1>
          <Link to={`/posts/${id}`} className={styles.backButton}>
            ← 投稿に戻る
          </Link>
        </div>
        
        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}
        
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
