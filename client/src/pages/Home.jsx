import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import PostCard from '../components/posts/PostCard';
import styles from './Home.module.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  // URLクエリパラメータを取得
  const getQueryParams = () => {
    const searchParams = new URLSearchParams(location.search);
    return {
      category: searchParams.get('category'),
      search: searchParams.get('search'),
      pinned: searchParams.get('pinned') === 'true'
    };
  };

  // APIクエリパラメータを構築
  const buildApiQuery = (params) => {
    const queryParams = new URLSearchParams();
    
    if (params.category) {
      queryParams.append('category', params.category);
    }
    
    if (params.search) {
      queryParams.append('search', params.search);
    }
    
    if (params.pinned) {
      queryParams.append('pinned', 'true');
    }
    
    const queryString = queryParams.toString();
    return queryString ? `?${queryString}` : '';
  };

  // 投稿を取得
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const params = getQueryParams();
        const queryString = buildApiQuery(params);
        
        const token = localStorage.getItem('token');
        const config = token ? {
          headers: { Authorization: `Bearer ${token}` }
        } : {};
        
        const response = await axios.get(`${API_URL}/posts${queryString}`, config);
        setPosts(response.data);
        setLoading(false);
      } catch (err) {
        console.error('投稿の取得に失敗:', err);
        setError('投稿の読み込みに失敗しました');
        setLoading(false);
      }
    };

    fetchPosts();
  }, [location.search]);

  // 投稿の更新
  const handlePostUpdate = (postId, updates) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId ? { ...post, ...updates } : post
      )
    );
  };

  // 現在のフィルタに基づくタイトルを生成
  const getPageTitle = () => {
    const params = getQueryParams();
    
    if (params.pinned) {
      return 'ピン留め投稿';
    }
    
    if (params.category) {
      return `${params.category}の投稿`;
    }
    
    if (params.search) {
      return `"${params.search}"の検索結果`;
    }
    
    return '最新の投稿';
  };

  return (
    <div className={styles.homePage}>
      <h1 className={styles.pageTitle}>{getPageTitle()}</h1>
      
      {loading ? (
        <div className={styles.loading}>投稿を読み込み中...</div>
      ) : error ? (
        <div className={styles.error}>{error}</div>
      ) : posts.length === 0 ? (
        <div className={styles.noPosts}>
          <p>投稿が見つかりませんでした。</p>
          <p>条件を変更するか、新しい投稿を作成してください。</p>
        </div>
      ) : (
        <div className={styles.postsList}>
          {posts.map(post => (
            <PostCard 
              key={post.id} 
              post={post} 
              onUpdate={handlePostUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;