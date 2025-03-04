import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import axios from 'axios';

// コンポーネント
import CommentForm from '../components/comments/CommentForm';
import CommentList from '../components/comments/CommentList';
import LikeButton from '../components/posts/LikeButton';
import Loading from '../components/ui/Loading';

// スタイル - 将来的にはモジュールCSSを作成
const styles = {
  container: {
    padding: '2rem 0',
  },
  headerImage: {
    width: '100%',
    maxHeight: '400px',
    objectFit: 'cover',
    borderRadius: '8px',
    marginBottom: '2rem',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '2rem',
  },
  title: {
    fontSize: '2rem',
    marginTop: 0,
    marginBottom: '0.5rem',
  },
  meta: {
    display: 'flex',
    alignItems: 'center',
    color: '#6c757d',
    fontSize: '0.9rem',
    marginBottom: '1rem',
  },
  author: {
    display: 'flex',
    alignItems: 'center',
    marginRight: '1rem',
  },
  authorAvatar: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    marginRight: '0.5rem',
  },
  date: {
    marginRight: '1rem',
  },
  categories: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '1rem',
  },
  category: {
    backgroundColor: '#e9ecef',
    color: '#212529',
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    fontSize: '0.8rem',
  },
  content: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
    marginBottom: '2rem',
  },
  contentText: {
    lineHeight: '1.6',
  },
  actions: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '2rem',
  },
  postActions: {
    display: 'flex',
    gap: '1rem',
  },
  editButton: {
    display: 'inline-flex',
    alignItems: 'center',
    color: '#4a90e2',
    textDecoration: 'none',
    fontSize: '0.9rem',
  },
  deleteButton: {
    display: 'inline-flex',
    alignItems: 'center',
    color: '#d9534f',
    backgroundColor: 'transparent',
    border: 'none',
    padding: 0,
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  backLink: {
    display: 'inline-flex',
    alignItems: 'center',
    color: '#4a90e2',
    textDecoration: 'none',
  },
  commentsContainer: {
    marginTop: '2rem',
  },
  commentsHeader: {
    fontSize: '1.5rem',
    marginBottom: '1rem',
  },
  noCommentsText: {
    color: '#6c757d',
    textAlign: 'center',
    padding: '1rem',
  },
};

const PostDetail = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        
        // 実際のAPIを使用する場合
        // const response = await axios.get(`/api/posts/${id}`);
        // setPost(response.data);
        
        // モックデータ
        const postId = parseInt(id);
        
        // モックデータの配列
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
          }
        ];
        
        // IDに一致する投稿を検索
        const matchingPost = mockPosts.find(post => post.id === postId);
        
        if (matchingPost) {
          setPost(matchingPost);
        } else {
          setError('指定された投稿が見つかりません');
        }
        
        setLoading(false);
      } catch (err) {
        console.error('投稿の取得に失敗しました', err);
        setError('投稿の取得に失敗しました。もう一度お試しください。');
        setLoading(false);
      }
    };
    
    fetchPost();
  }, [id]);
  
  const handleLike = async () => {
    try {
      // 実際はAPIを呼び出してデータを更新する
      // この例ではクライアント側だけで疑似的に更新
      const likedByCurrentUser = post.likes.some(like => like.user_id === currentUser.id);
      
      if (likedByCurrentUser) {
        // いいねの取り消し
        setPost({
          ...post,
          likes: post.likes.filter(like => like.user_id !== currentUser.id)
        });
      } else {
        // いいねの追加
        setPost({
          ...post,
          likes: [...post.likes, { user_id: currentUser.id }]
        });
      }
    } catch (err) {
      console.error('いいねの更新に失敗しました', err);
    }
  };
  
  const handleDelete = async () => {
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      return;
    }
    
    try {
      // 実際はAPIを呼び出して投稿を削除する
      // await axios.delete(`/api/posts/${id}`);
      
      // 削除成功後、ホームページにリダイレクト
      navigate('/');
    } catch (err) {
      console.error('投稿の削除に失敗しました', err);
      setError('投稿の削除に失敗しました。もう一度お試しください。');
    }
  };
  
  const handleAddComment = (newComment) => {
    // 新しいコメントを投稿に追加
    setPost({
      ...post,
      comments: [...post.comments, newComment]
    });
  };
  
  const handleDeleteComment = (commentId) => {
    // コメントを削除
    setPost({
      ...post,
      comments: post.comments.filter(comment => comment.id !== commentId)
    });
  };

  // マークダウン風テキストをHTMLに変換
  const renderFormattedContent = (text) => {
    if (!text) return null;

    // 行ごとに処理
    return text.split('\n').map((line, i) => {
      // ヘッダーの処理
      if (line.startsWith('## ')) {
        return <h2 key={i}>{line.replace('## ', '')}</h2>;
      }
      if (line.startsWith('### ')) {
        return <h3 key={i}>{line.replace('### ', '')}</h3>;
      }
      
      // リストの処理
      if (line.startsWith('- ')) {
        return <li key={i}>{formatInline(line.replace('- ', ''))}</li>;
      }
      
      // 画像の処理
      const imgRegex = /!\[([^\]]*)\]\(([^)]*)\)/g;
      let processedLine = line;
      const images = [];
      let imgMatch;
      
      while ((imgMatch = imgRegex.exec(line)) !== null) {
        const [fullMatch, alt, src] = imgMatch;
        images.push({ alt, src, fullMatch });
      }
      
      if (images.length > 0) {
        // 画像がある場合、画像とその前後のテキストを分割して表示
        let parts = [];
        let lastIndex = 0;
        
        images.forEach(({ fullMatch, alt, src }, index) => {
          // 画像の前のテキスト
          if (processedLine.indexOf(fullMatch) > lastIndex) {
            const textBefore = processedLine.substring(lastIndex, processedLine.indexOf(fullMatch));
            parts.push(
              <span key={`${i}-text-${index}`}>
                {formatInline(textBefore)}
              </span>
            );
          }
          
          // 画像
          parts.push(
            <img
              key={`${i}-img-${index}`}
              src={src}
              alt={alt}
              style={{ maxWidth: '100%', borderRadius: '4px', margin: '1rem 0' }}
            />
          );
          
          lastIndex = processedLine.indexOf(fullMatch) + fullMatch.length;
        });
        
        // 最後の画像の後のテキスト
        if (lastIndex < processedLine.length) {
          parts.push(
            <span key={`${i}-text-last`}>
              {formatInline(processedLine.substring(lastIndex))}
            </span>
          );
        }
        
        return <div key={i}>{parts}</div>;
      }
      
      // 通常のテキスト
      if (line.trim() === '') {
        return <br key={i} />;
      }
      
      return <p key={i}>{formatInline(line)}</p>;
    });
  };

  // インラインのフォーマット（太字、イタリック、下線）を処理
  const formatInline = (text) => {
    // 段階的に変換して、変換済みの部分を保護
    let formatted = text;
    
    // 太字
    formatted = formatted.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    
    // イタリック
    formatted = formatted.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    
    // 下線
    formatted = formatted.replace(/__([^_]+)__/g, '<u>$1</u>');
    
    return <span dangerouslySetInnerHTML={{ __html: formatted }} />;
  };
  
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
  
  if (!post) return null;
  
  const isAuthor = currentUser && post.author.id === currentUser.id;
  const isAdmin = currentUser && currentUser.role === 'admin';
  const canEdit = isAuthor || isAdmin;
  
  return (
    <div className="container" style={styles.container}>
      <Link to="/" style={styles.backLink}>
        ← ホームに戻る
      </Link>
      
      {post.headerImage && (
        <img
          src={post.headerImage}
          alt={post.title}
          style={styles.headerImage}
        />
      )}
      
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>{post.title}</h1>
          <div style={styles.meta}>
            <div style={styles.author}>
              <img
                src={post.author.avatar_url || '/default-avatar.png'}
                alt={post.author.name}
                style={styles.authorAvatar}
              />
              <span>{post.author.name} ({post.author.department})</span>
            </div>
            <div style={styles.date}>
              {format(new Date(post.created_at), 'yyyy年MM月dd日 HH:mm', { locale: ja })}
            </div>
          </div>
          <div style={styles.categories}>
            {post.categories.map((category, index) => (
              <Link to={`/?category=${encodeURIComponent(category.name)}`} key={index} style={{ textDecoration: 'none' }}>
                <span style={styles.category}>{category.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
      
      <div style={styles.content}>
        <div style={styles.contentText}>
          {renderFormattedContent(post.content)}
        </div>
      </div>
      
      <div style={styles.actions}>
        <LikeButton
          likes={post.likes}
          currentUser={currentUser}
          onLike={handleLike}
        />
        
        {canEdit && (
          <div style={styles.postActions}>
            <Link to={`/posts/edit/${post.id}`} style={styles.editButton}>
              編集
            </Link>
            <button
              onClick={handleDelete}
              style={styles.deleteButton}
            >
              {deleteConfirm ? '削除を確認' : '削除'}
            </button>
          </div>
        )}
      </div>
      
      <div style={styles.commentsContainer}>
        <h2 style={styles.commentsHeader}>コメント ({post.comments.length})</h2>
        
        {currentUser ? (
          <CommentForm postId={post.id} onAddComment={handleAddComment} />
        ) : (
          <p style={{ marginBottom: '1rem' }}>
            コメントを投稿するには<Link to="/login">ログイン</Link>してください
          </p>
        )}
        
        {post.comments.length > 0 ? (
          <CommentList 
            comments={post.comments} 
            currentUser={currentUser} 
            onDeleteComment={handleDeleteComment}
          />
        ) : (
          <p style={styles.noCommentsText}>
            コメントはまだありません。最初のコメントを投稿しましょう。
          </p>
        )}
      </div>
    </div>
  );
};

export default PostDetail;
