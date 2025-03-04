import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import PostCard from '../components/posts/PostCard';
import Loading from '../components/ui/Loading';
import styles from './Home.module.css';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [pinnedPosts, setPinnedPosts] = useState([]);
  const [regularPosts, setRegularPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // URLからクエリパラメータを取得
  const getQueryParams = () => {
    const searchParams = new URLSearchParams(location.search);
    return {
      category: searchParams.get('category'),
      search: searchParams.get('search')
    };
  };

  // カテゴリ一覧を取得
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // APIからカテゴリを取得
        const response = await axios.get('/api/categories');
        setCategories(response.data || []);
      } catch (err) {
        console.error('カテゴリの取得に失敗:', err);
        
        // エラー時はモックデータを使用
        const mockCategories = [
          { id: 1, name: 'お知らせ', description: '会社からの公式なお知らせや通知を掲載します', is_active: true },
          { id: 2, name: 'プロジェクト', description: '社内の各種プロジェクトに関する情報を共有します', is_active: true },
          { id: 3, name: '社員インタビュー', description: '社員の仕事や趣味などを紹介するインタビュー記事です', is_active: true },
          { id: 4, name: 'イベント', description: '社内イベントや外部イベントの情報を掲載します', is_active: true },
          { id: 5, name: '社内システム', description: '業務システムや社内ツールに関する情報です', is_active: true },
          { id: 6, name: '募集', description: '社内での募集やプロジェクトメンバー募集などの情報です', is_active: true },
          { id: 7, name: 'マーケティング部', description: 'マーケティング部からの情報発信です', is_active: true },
          { id: 8, name: '営業部', description: '営業部からの情報発信です', is_active: true },
          { id: 9, name: '開発部', description: '開発部からの情報発信です', is_active: true },
          { id: 10, name: '人事部', description: '人事部からの情報発信です', is_active: true },
          { id: 11, name: '広報部', description: '広報部からの情報発信です', is_active: true },
          { id: 12, name: 'IT部', description: 'IT部からの情報発信です', is_active: true }
        ];
        setCategories(mockCategories);
      }
    };

    fetchCategories();
  }, []);

  // 投稿一覧を取得
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // クエリパラメータを取得
        const { category, search } = getQueryParams();
        
        // APIから投稿を取得
        const response = await axios.get('/api/posts', {
          params: { 
            category, 
            search,
            page: 1,
            limit: 50 // 最大50件取得
          }
        });
        
        // データチェック
        if (!response.data || !response.data.data) {
          throw new Error('投稿データの形式が正しくありません');
        }
        
        const postsData = response.data.data;
        
        // 投稿をピン留めとそれ以外に分類
        const pinned = postsData.filter(post => post.isPinned);
        const regular = postsData.filter(post => !post.isPinned);

        setPinnedPosts(pinned);
        setRegularPosts(regular);
        setPosts(postsData);
        setLoading(false);
      } catch (err) {
        console.error('投稿の取得に失敗:', err);
        setError('投稿の読み込みに失敗しました。後でもう一度お試しください。');
        
        // クエリパラメータを再取得（エラー処理内でも利用するため）
        const { category, search } = getQueryParams();
        
        // エラー時はモックデータを使用
        const mockPosts = [
          {
            id: 1,
            title: '新しい社内報システムのβ版がリリースされました！',
            content: '## ConnectHubのリリースについて\n\n長らくお待たせしました。本日より新しい社内報システム「ConnectHub」のβ版をリリースします。\n\n主な機能は以下の通りです：\n\n- 投稿機能：テキスト、画像、ファイル添付が可能な記事投稿\n- いいね機能：投稿へのリアクション機能\n- コメント機能：投稿へのコメント（自分のコメント削除可能）\n- カテゴリ機能：記事のカテゴリ分類と絞り込み表示\n- ピックアップ記事：重要な投稿を上部に固定表示\n\n![システムイメージ](https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80)\n\nご不明な点があればIT部までお問い合わせください。',
            headerImage: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
            author: {
              id: 1,
              name: '管理者 太郎',
              department: 'IT部',
              avatar_url: '/avatars/admin.jpg'
            },
            categories: [{ name: 'お知らせ' }, { name: '社内システム' }],
            isPinned: true,
            created_at: new Date(),
            likes: [{ user_id: 2 }, { user_id: 3 }],
            comments_count: 1
          },
          {
            id: 2,
            title: '4月からの新プロジェクトメンバー募集',
            content: '## 次期基幹システム開発プロジェクト\n\n次期基幹システム開発プロジェクトのメンバーを募集します。興味のある方は詳細をご確認ください。',
            headerImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
            author: {
              id: 3,
              name: '山田 太郎',
              department: '開発部',
              avatar_url: '/avatars/yamada.jpg'
            },
            categories: [{ name: 'プロジェクト' }, { name: '募集' }],
            isPinned: false,
            created_at: new Date(),
            likes: [{ user_id: 1 }],
            comments_count: 0
          }
        ];
        
        // カテゴリでフィルタリング
        let filteredPosts = [...mockPosts];
        if (category) {
          filteredPosts = filteredPosts.filter(post => 
            post.categories.some(cat => cat.name === category)
          );
        }

        // 検索でフィルタリング
        if (search) {
          const searchLower = search.toLowerCase();
          filteredPosts = filteredPosts.filter(post => 
            post.title.toLowerCase().includes(searchLower) || 
            post.content.toLowerCase().includes(searchLower)
          );
        }

        // 投稿をピン留めとそれ以外に分類
        const pinned = filteredPosts.filter(post => post.isPinned);
        const regular = filteredPosts.filter(post => !post.isPinned);

        setPinnedPosts(pinned);
        setRegularPosts(regular);
        setPosts(filteredPosts);
        setLoading(false);
      }
    };

    fetchPosts();
  }, [location.search]);

  // ページタイトルを生成
  const getPageTitle = () => {
    const { category, search } = getQueryParams();
    
    if (search) {
      return `「${search}」の検索結果`;
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
    
    // ピン留めと通常の投稿リストも更新
    if (updates.isPinned !== undefined) {
      if (updates.isPinned) {
        // ピン留めに追加
        const updatedPost = posts.find(post => post.id === postId);
        if (updatedPost) {
          setPinnedPosts(prev => [...prev, { ...updatedPost, ...updates }]);
          setRegularPosts(prev => prev.filter(post => post.id !== postId));
        }
      } else {
        // ピン留めから削除
        const updatedPost = posts.find(post => post.id === postId);
        if (updatedPost) {
          setRegularPosts(prev => [...prev, { ...updatedPost, ...updates }]);
          setPinnedPosts(prev => prev.filter(post => post.id !== postId));
        }
      }
    }
  };

  // 現在選択されているカテゴリ
  const selectedCategory = getQueryParams().category;

  return (
    <div className={styles.homeContainer}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>{getPageTitle()}</h1>
        {currentUser && (
          <Link to="/posts/create" className={styles.createPostBtn}>
            + 新規投稿
          </Link>
        )}
      </div>

      <div className={styles.content}>
        <div className={styles.mainContent}>
          {loading ? (
            <Loading />
          ) : error ? (
            <div className={styles.error}>{error}</div>
          ) : posts.length === 0 ? (
            <div className={styles.noPostsMessage}>
              <p>投稿が見つかりませんでした</p>
              {getQueryParams().category && (
                <button 
                  className={styles.backButton}
                  onClick={() => navigate('/')}
                >
                  すべての投稿を表示
                </button>
              )}
            </div>
          ) : (
            <>
              {pinnedPosts.length > 0 && (
                <div className={styles.pinnedPosts}>
                  <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>
                      <span className={styles.pinnedIcon}>📌</span>
                      ピン留め投稿
                    </h2>
                  </div>
                  <div className={styles.postList}>
                    {pinnedPosts.map(post => (
                      <PostCard 
                        key={post.id} 
                        post={post} 
                        currentUser={currentUser}
                        onUpdate={handlePostUpdate}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className={styles.regularPosts}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>投稿一覧</h2>
                </div>
                <div className={styles.postList}>
                  {regularPosts.map(post => (
                    <PostCard 
                      key={post.id} 
                      post={post} 
                      currentUser={currentUser}
                      onUpdate={handlePostUpdate}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <div className={styles.filterSection}>
          <h3 className={styles.filterSectionTitle}>カテゴリ</h3>
          <ul className={styles.categoryList}>
            <li className={styles.categoryItem}>
              <Link
                to="/"
                className={`${styles.categoryLink} ${!selectedCategory ? styles.active : ''}`}
              >
                すべての投稿
              </Link>
            </li>
            {categories.map(category => (
              <li key={category.id} className={styles.categoryItem}>
                <Link
                  to={`/?category=${encodeURIComponent(category.name)}`}
                  className={`${styles.categoryLink} ${selectedCategory === category.name ? styles.active : ''}`}
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home;