import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PostForm from '../components/posts/PostForm';
import styles from './CreatePost.module.css';

const CreatePost = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // 投稿送信処理
  const handleSubmit = async (postData) => {
    try {
      setIsSubmitting(true);
      
      // 実際の環境では、ここでAPIを使って投稿データをサーバーに送信します
      // const response = await axios.post('/api/posts', postData);
      
      // モック処理（実際はAPIを使います）
      console.log('投稿データ:', postData);
      
      // 送信成功後、少し待機してからホーム画面に遷移
      setTimeout(() => {
        alert('投稿が作成されました！');
        navigate('/');
      }, 500);
      
    } catch (error) {
      console.error('投稿の作成に失敗しました:', error);
      alert('投稿の作成に失敗しました。再度お試しください。');
      setIsSubmitting(false);
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