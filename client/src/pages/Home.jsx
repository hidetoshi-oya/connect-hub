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
            content: '## 次期基幹システム開発プロジェクト\n\n次期基幹システム開発プロジェクトのメンバーを募集します。興味のある方は詳細をご確認ください。\n\n### プロジェクト概要\n- 基幹システムリニューアル\n- 開発期間：2023年4月〜2024年3月\n- 使用技術：React, Node.js, MySQL\n\n### 募集人数\n- フロントエンド開発：2名\n- バックエンド開発：2名\n- インフラ担当：1名\n\n![開発イメージ](https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80)\n\n### 応募方法\n開発部の山田までメールにてご連絡ください。\n応募締切：3月20日',
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
            comments: []
          },
          {
            id: 3,
            title: '社内イベントのお知らせ：夏祭り',
            content: '## 社内夏祭りのお知らせ\n\n今年も社内夏祭りを開催します。皆様のご参加をお待ちしております。\n\n### 開催日時\n2023年7月15日（土）15:00〜20:00\n\n### 場所\n本社屋上ガーデン\n\n### 内容\n- バーベキュー\n- ビアガーデン\n- ゲーム大会\n- カラオケ大会\n\n![夏祭りイメージ](https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80)\n\n### 参加費\n無料（ご家族の参加も歓迎します）\n\n### 申し込み方法\n人事部の花子までメールにてご連絡ください。\n申し込み締切：7月5日',
            headerImage: 'https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
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
            content: '## 4月の営業実績について\n\n4月の営業実績についてご報告いたします。目標達成率は112%と好調な結果となりました。\n\n### 主な成果\n- 新規顧客獲得: 15社\n- 受注額: 前年同月比120%\n- 顧客訪問数: 前年同月比115%\n\n![グラフイメージ](https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80)\n\n### 来月の目標\n- 新規顧客獲得: 20社\n- 受注額: 前年同月比125%\n- 顧客満足度の向上施策の展開\n\n詳細は社内共有フォルダの報告書をご覧ください。',
            headerImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
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
            content: '## 新入社員インタビュー\n\n今年度入社した佐藤さんにインタビューしました。大学時代の研究や入社の志望動機について語っていただきました。\n\n### プロフィール\n- 名前: 佐藤 二郎\n- 所属: マーケティング部\n- 趣味: 写真撮影、旅行\n\n### 大学時代の研究について\n大学では消費者行動論を専攻し、ソーシャルメディアが購買意思決定に与える影響について研究していました。特にインフルエンサーマーケティングの効果測定に関する研究が主なテーマでした。\n\n![インタビュー写真](https://images.unsplash.com/photo-1555421689-491a97ff2040?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80)\n\n### 入社の志望動機\n当社の革新的なマーケティング施策に関心があり、自分の研究成果を実務に活かしたいと考えたことが主な志望動機です。また、グローバルに展開している点も魅力に感じました。\n\n### 今後の抱負\nデジタルマーケティングの最新手法を積極的に取り入れながら、当社のブランド価値向上に貢献していきたいです。5年後には海外拠点での勤務も視野に入れています。',
            headerImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
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
          },
          {
            id: 6,
            title: '新オフィスへの移転のお知らせ',
            content: '## 新オフィス移転のお知らせ\n\n業務拡大に伴い、来月より新オフィスへ移転することとなりましたのでお知らせいたします。\n\n### 新オフィス所在地\n東京都千代田区丸の内1-1-1 丸の内センタービル15階\n\n### 移転日\n2023年6月1日（土）\n\n### 新オフィスの特徴\n- 床面積: 現オフィスの約1.5倍\n- フリーアドレス制の導入\n- 会議室の増設（小: 10室、中: 5室、大: 3室）\n- リフレッシュスペースの拡充\n- 最寄駅からの利便性向上\n\n![新オフィスイメージ](https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80)\n\n### 移転に関する注意事項\n- 5月25日（土）から段階的に荷物の移動を開始します\n- 5月30日（金）は原則在宅勤務をお願いします\n- 個人の荷物の整理は5月20日までに完了してください\n\n詳細は後日、総務部より改めてご連絡いたします。ご不明な点がありましたら総務部までお問い合わせください。',
            headerImage: 'https://images.unsplash.com/photo-1564069114553-7215e1ff1890?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
            author: {
              id: 6,
              name: '総務 三郎',
              department: '総務部',
              avatar_url: '/avatars/default.jpg'
            },
            categories: [{ name: 'お知らせ' }],
            isPinned: true,
            created_at: new Date(),
            likes: [{ user_id: 1 }, { user_id: 2 }, { user_id: 3 }],
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
