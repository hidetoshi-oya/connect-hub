import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PostCard from '../components/posts/PostCard';
import styles from './Home.module.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // URLからクエリパラメータを取得
  const getQueryParams = () => {
    const searchParams = new URLSearchParams(location.search);
    return {
      category: searchParams.get('category'),
      search: searchParams.get('search'),
      pinned: searchParams.get('pinned') === 'true'
    };
  };

  // 投稿一覧を取得
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        
        // クエリパラメータを取得
        const { category, search, pinned } = getQueryParams();
        
        // API用クエリパラメータを構築
        let queryParams = [];
        if (category) queryParams.push(`category=${encodeURIComponent(category)}`);
        if (search) queryParams.push(`search=${encodeURIComponent(search)}`);
        if (pinned) queryParams.push('pinned=true');
        
        const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
        
        // 投稿一覧を取得
        const response = await axios.get(`${API_URL}/posts${queryString}`);
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

  // ページタイトルを生成
  const getPageTitle = () => {
    const { category, search, pinned } = getQueryParams();
    
    if (search) {
      return `「${search}」の検索結果`;
    } else if (pinned) {
      return 'ピン留め投稿';
    } else if (category) {
      return `${category}の投稿`;
    } else {
      return '最新の投稿';
    }
  };

  // 投稿の更新処理
  const handlePostUpdate = (postId, updates) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId ? { ...post, ...updates } : post
      )
    );
  };

  return (
    <div className={styles.homePage}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>{getPageTitle()}</h1>
        {getQueryParams().category && (
          <button 
            className={styles.clearFilterButton}
            onClick={() => navigate('/')}
          >
            フィルタをクリア
          </button>
        )}
      </div>

      <div className={styles.postsContainer}>
        {loading ? (
          <div className={styles.loading}>投稿を読み込んでいます...</div>
        ) : error ? (
          <div className={styles.error}>{error}</div>
        ) : posts.length === 0 ? (
          <div className={styles.noPosts}>
            <p>投稿が見つかりませんでした</p>
            {getQueryParams().category && (
              <button 
                className={styles.clearFilterButton}
                onClick={() => navigate('/')}
              >
                フィルタをクリアして全ての投稿を表示
              </button>
            )}
          </div>
        ) : (
          posts.map(post => (
            <PostCard 
              key={post.id} 
              post={post} 
              onUpdate={handlePostUpdate}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Home;