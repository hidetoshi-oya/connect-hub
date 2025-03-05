import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PostForm from '../components/posts/PostForm';
import { useAuth } from '../contexts/AuthContext';
import styles from './CreatePost.module.css';

const CreatePost = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // 投稿送信処理
  const handleSubmit = async (postData) => {
    // ヘッダー画像が File オブジェクトの場合はアップロード処理を行う
    let headerImageUrl = postData.headerImage;
    
    try {
      setIsSubmitting(true);
      setError('');
      
      if (postData.headerImageFile) {
        const formData = new FormData();
        formData.append('file', postData.headerImageFile);
        
        // 実際の環境ではこのようにファイルをアップロードします
        // const uploadResponse = await axios.post('/api/upload', formData);
        // headerImageUrl = uploadResponse.data.url;
      }
      
      // トークンを取得
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('認証情報がありません。再度ログインしてください。');
      }
      
      // APIを使って投稿データをサーバーに送信
      const response = await axios.post('/api/posts', {
        title: postData.title,
        content: postData.content,
        headerImage: headerImageUrl,
        categories: postData.categories,
        isPinned: postData.isPinned || false
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      // 成功メッセージを表示
      alert('投稿が作成されました！');
      
      // 投稿詳細ページにリダイレクト
      navigate(`/posts/${response.data.post.id}`);
      
    } catch (error) {
      console.error('投稿の作成に失敗しました:', error);
      
      if (error.response) {
        // サーバーからのエラーレスポンス
        setError(error.response.data.message || 'エラーが発生しました。再度お試しください。');
      } else if (error.request) {
        // リクエストは送信されたがレスポンスが返ってこない
        setError('サーバーに接続できませんでした。インターネット接続を確認してください。');
      } else {
        // リクエスト設定時に何らかのエラーが発生
        setError(error.message || 'リクエストの送信中にエラーが発生しました。');
      }
      
      setIsSubmitting(false);
      
      // 開発環境でのモック処理
      if (process.env.NODE_ENV === 'development') {
        const mockResponse = {
          data: {
            post: {
              id: Math.floor(Math.random() * 1000) + 10, // ランダムなID
              title: postData.title,
              content: postData.content,
              headerImage: headerImageUrl,
              categories: postData.categories.map(cat => ({ name: cat })),
              isPinned: postData.isPinned || false,
              author: currentUser,
              created_at: new Date().toISOString()
            }
          }
        };
        
        alert('開発モード: 投稿が作成されました！');
        navigate(`/posts/${mockResponse.data.post.id}`);
      }
    }
  };

  // キャンセル処理
  const handleCancel = () => {
    if (window.confirm('投稿作成をキャンセルしますか？入力した内容は失われます。')) {
      navigate('/');
    }
  };

  return (
    <div className={styles.createPostPage}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>新規投稿作成</h1>
        <p className={styles.pageDescription}>
          社内の情報や知識を共有しましょう。適切なカテゴリを選択し、わかりやすいタイトルと内容を心がけてください。
        </p>
      </div>
      
      {error && <div className={styles.errorMessage}>{error}</div>}
      
      <div className={styles.formContainer}>
        <PostForm 
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </div>
      
      <div className={styles.guideContainer}>
        <h3 className={styles.guideTitle}>投稿のヒント</h3>
        <ul className={styles.guideList}>
          <li>明確で簡潔なタイトルにしましょう</li>
          <li>適切なカテゴリを選択すると、関連する情報を探している人に見つけてもらいやすくなります</li>
          <li>長文の場合は、段落や見出しを使って読みやすくしましょう</li>
          <li>他の部署の人にもわかりやすい表現を心がけましょう</li>
          <li>質問や意見が欲しい場合は、その旨を明記しましょう</li>
        </ul>
      </div>
    </div>
  );
};

export default CreatePost;