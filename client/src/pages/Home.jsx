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
        // 実際のAPIを使用する場合
        // const response = await axios.get('/api/categories');
        // setCategories(response.data);

        // モックデータ
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
      } catch (err) {
        console.error('カテゴリの取得に失敗:', err);
      }
    };

    fetchCategories();
  }, []);

  // 投稿一覧を取得
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        
        // クエリパラメータを取得
        const { category, search } = getQueryParams();
        
        // 実際のAPIを使用する場合
        // const response = await axios.get('/api/posts', {
        //   params: { category, search }
        // });
        // setPosts(response.data);

        // モックデータ
        let mockPosts = [
          {
            id: 1,
            title: '新しい社内報システムのβ版がリリースされました！',
            content: '長らくお待たせしました。本日より新しい社内報システム「ConnectHub」のβ版をリリースします。',
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
            comments: [
              {
                id: 1,
                content: '待っていました！早速使ってみます。',
                author: {
                  id: 2,
                  name: 'モデレータ 花子',
                  department: '人事部',
                  avatar_url: '/avatars/moderator.jpg'
                },
                created_at: new Date()
              }
            ]
          },
          {
            id: 2,
            title: '4月からの新プロジェクトメンバー募集',
            content: '次期基幹システム開発プロジェクトのメンバーを募集します。興味のある方は詳細をご確認ください。',
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
            comments: []
          },
          {
            id: 3,
            title: '社内イベントのお知らせ：夏祭り',
            content: '今年も社内夏祭りを開催します。皆様のご参加をお待ちしております。',
            author: {
              id: 2,
              name: 'モデレータ 花子',
              department: '人事部',
              avatar_url: '/avatars/moderator.jpg'
            },
            categories: [{ name: 'イベント' }, { name: 'お知らせ' }],
            isPinned: true,
            created_at: new Date(),
            likes: [{ user_id: 1 }, { user_id: 3 }],
            comments: []
          },
          {
            id: 4,
            title: '営業部からの月次報告',
            content: '4月の営業実績についてご報告いたします。目標達成率は112%と好調な結果となりました。',
            author: {
              id: 4,
              name: '鈴木 一郎',
              department: '営業部',
              avatar_url: '/avatars/default.jpg'
            },
            categories: [{ name: '営業部' }],
            isPinned: false,
            created_at: new Date(),
            likes: [],
            comments: []
          },
          {
            id: 5,
            title: '新入社員インタビュー：佐藤さん',
            content: '今年度入社した佐藤さんにインタビューしました。大学時代の研究や入社の志望動機について語っていただきました。',
            author: {
              id: 5,
              name: '佐藤 二郎',
              department: '人事部',
              avatar_url: '/avatars/default.jpg'
            },
            categories: [{ name: '社員インタビュー' }],
            isPinned: false,
            created_at: new Date(),
            likes: [{ user_id: 2 }],
            comments: []
          }
        ];

        // カテゴリでフィルタリング
        if (category) {
          mockPosts = mockPosts.filter(post => 
            post.categories.some(cat => cat.name === category)
          );
        }

        // 検索でフィルタリング
        if (search) {
          const searchLower = search.toLowerCase();
          mockPosts = mockPosts.filter(post => 
            post.title.toLowerCase().includes(searchLower) || 
            post.content.toLowerCase().includes(searchLower)
          );
        }

        // 投稿をピン留めとそれ以外に分類
        const pinned = mockPosts.filter(post => post.isPinned);
        const regular = mockPosts.filter(post => !post.isPinned);

        setPinnedPosts(pinned);
        setRegularPosts(regular);
        setPosts(mockPosts);
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
  };

  // カテゴリリンクがクリックされたときの処理
  const handleCategoryClick = (categoryName) => {
    navigate(`/?category=${encodeURIComponent(categoryName)}`);
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
                  className="btn btn-primary"
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
