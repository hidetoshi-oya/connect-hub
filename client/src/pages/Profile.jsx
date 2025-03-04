import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

// コンポーネント
import PostCard from '../components/posts/PostCard';
import Loading from '../components/ui/Loading';

// スタイル - 将来的にはモジュールCSSを作成
const styles = {
  container: {
    padding: '2rem 0',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '2rem',
  },
  avatar: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    objectFit: 'cover',
    marginRight: '2rem',
  },
  userInfo: {
    flex: 1,
  },
  name: {
    fontSize: '2rem',
    marginTop: 0,
    marginBottom: '0.5rem',
  },
  meta: {
    display: 'flex',
    flexDirection: 'column',
    color: '#6c757d',
    marginBottom: '1rem',
  },
  metaItem: {
    marginBottom: '0.25rem',
  },
  editButton: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0.5rem 1rem',
    backgroundColor: '#4a90e2',
    color: 'white',
    borderRadius: '4px',
    textDecoration: 'none',
    fontSize: '0.9rem',
  },
  tabs: {
    display: 'flex',
    borderBottom: '1px solid #dee2e6',
    marginBottom: '1.5rem',
  },
  tab: {
    padding: '0.75rem 1rem',
    cursor: 'pointer',
    borderBottom: '2px solid transparent',
  },
  activeTab: {
    borderBottomColor: '#4a90e2',
    fontWeight: 'bold',
  },
  postList: {
    display: 'grid',
    gap: '1rem',
  },
  message: {
    textAlign: 'center',
    padding: '2rem',
    color: '#6c757d',
  },
  backLink: {
    display: 'inline-flex',
    alignItems: 'center',
    color: '#4a90e2',
    textDecoration: 'none',
    marginBottom: '1rem',
  },
};

const Profile = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('posts');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        
        // この部分は実際のAPIエンドポイントに置き換える
        // 開発用のモックデータ
        const userData = {
          id: parseInt(id),
          name: id === '1' ? '管理者 太郎' : '山田 太郎',
          email: id === '1' ? 'admin@example.com' : 'yamada@example.com',
          department: id === '1' ? 'IT部' : '営業部',
          role: id === '1' ? 'admin' : 'contributor',
          avatar_url: id === '1' ? '/avatars/admin.jpg' : '/avatars/yamada.jpg',
          bio: 'ConnectHubの開発と運営を担当しています。',
          joinDate: '2023-01-01'
        };
        
        setUser(userData);
        
        // 投稿データのモック
        const postsData = [
          {
            id: 1,
            title: '新しい社内報システムのβ版がリリースされました！',
            content: '長らくお待たせしました。本日より新しい社内報システム「ConnectHub」のβ版をリリースします。',
            author: userData,
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
          }
        ];
        
        // ユーザーIDに応じて投稿を返す
        if (id === '1') {
          setPosts(postsData);
        } else {
          setPosts([{
            id: 2,
            title: '4月からの新プロジェクトメンバー募集',
            content: '次期基幹システム開発プロジェクトのメンバーを募集します。興味のある方は詳細をご確認ください。',
            author: userData,
            categories: [{ name: 'プロジェクト' }, { name: '募集' }],
            isPinned: false,
            created_at: new Date(),
            likes: [{ user_id: 1 }],
            comments: []
          }]);
        }
        
        // いいねした投稿（すべてのユーザーで同じデータを使用）
        setLikedPosts([{
          id: 3,
          title: '社内イベントのお知らせ：夏祭り',
          content: '今年も社内夏祭りを開催します。皆様のご参加をお待ちしております。',
          author: {
            id: 2,
            name: 'モデレータ 花子',
            department: '人事部',
            avatar_url: '/avatars/moderator.jpg'
          },
          categories: [{ name: 'イベント' }],
          isPinned: false,
          created_at: new Date(),
          likes: [{ user_id: 1 }, { user_id: 3 }],
          comments: []
        }]);
        
      } catch (err) {
        console.error('プロフィールの取得に失敗しました', err);
        setError('プロフィールの取得に失敗しました。もう一度お試しください。');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [id]);
  
  if (loading) return <Loading />;
  
  if (error) {
    return (
      <div className="container" style={styles.container}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>{error}</p>
          <Link to="/" style={styles.backLink}>
            ← ホームに戻る
          </Link>
        </div>
      </div>
    );
  }
  
  if (!user) return null;
  
  const isCurrentUser = currentUser && currentUser.id === user.id;
  
  return (
    <div className="container" style={styles.container}>
      <Link to="/" style={styles.backLink}>
        ← ホームに戻る
      </Link>
      
      <div style={styles.header}>
        <img
          src={user.avatar_url || '/default-avatar.png'}
          alt={user.name}
          style={styles.avatar}
        />
        
        <div style={styles.userInfo}>
          <h1 style={styles.name}>{user.name}</h1>
          
          <div style={styles.meta}>
            <div style={styles.metaItem}>{user.department}</div>
            <div style={styles.metaItem}>{user.email}</div>
            <div style={styles.metaItem}>
              ロール: {
                user.role === 'admin' ? '管理者' :
                user.role === 'moderator' ? 'モデレーター' :
                user.role === 'contributor' ? '投稿者' : '閲覧者'
              }
            </div>
          </div>
          
          {isCurrentUser && (
            <Link to="/profile/edit" style={styles.editButton}>
              プロフィールを編集
            </Link>
          )}
        </div>
      </div>
      
      <div style={styles.tabs}>
        <div
          style={{
            ...styles.tab,
            ...(activeTab === 'posts' ? styles.activeTab : {})
          }}
          onClick={() => setActiveTab('posts')}
        >
          投稿 ({posts.length})
        </div>
        <div
          style={{
            ...styles.tab,
            ...(activeTab === 'liked' ? styles.activeTab : {})
          }}
          onClick={() => setActiveTab('liked')}
        >
          いいねした投稿 ({likedPosts.length})
        </div>
      </div>
      
      {activeTab === 'posts' && (
        <div style={styles.postList}>
          {posts.length > 0 ? (
            posts.map(post => (
              <PostCard key={post.id} post={post} currentUser={currentUser} />
            ))
          ) : (
            <div style={styles.message}>
              投稿がありません。
            </div>
          )}
        </div>
      )}
      
      {activeTab === 'liked' && (
        <div style={styles.postList}>
          {likedPosts.length > 0 ? (
            likedPosts.map(post => (
              <PostCard key={post.id} post={post} currentUser={currentUser} />
            ))
          ) : (
            <div style={styles.message}>
              いいねした投稿がありません。
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
