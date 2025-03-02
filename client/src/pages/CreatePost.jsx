import React from 'react';
import PostForm from '../components/posts/PostForm';
import styles from './CreatePost.module.css';

const CreatePost = () => {
  return (
    <div className={styles.createPostPage}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>新規投稿作成</h1>
        <p className={styles.pageDescription}>
          社内の情報や知識を共有しましょう。適切なカテゴリを選択し、わかりやすいタイトルと内容を心がけてください。
        </p>
      </div>
      
      <div className={styles.formContainer}>
        <PostForm />
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