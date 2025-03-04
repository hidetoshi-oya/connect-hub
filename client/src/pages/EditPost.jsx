import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import PostForm from '../components/posts/PostForm';
import Loading from '../components/ui/Loading';
import styles from './CreatePost.module.css';

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        
        // 実際のAPIを使用する場合
        // const response = await axios.get(`/api/posts/${id}`);
        // setPost(response.data);
        
        // モックデータの配列
        const postId = parseInt(id);
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
          
          // 権限チェック - 自分の投稿または管理者でない場合はリダイレクト
          if (currentUser && currentUser.id !== matchingPost.author.id && currentUser.role !== 'admin') {
            navigate('/');
          }
        } else {
          setError('指定された投稿が見つかりません');
        }
      } catch (err) {
        console.error('投稿の取得に失敗しました', err);
        setError('投稿の取得に失敗しました。もう一度お試しください。');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPost();
  }, [id, currentUser, navigate]);
  
  const handleSubmit = async (formData) => {
    try {
      setSubmitting(true);
      setError('');
      
      // 実際はAPIを呼び出して投稿を更新する
      // const response = await axios.put(`/api/posts/${id}`, formData);
      console.log('更新データ:', formData);
      
      // 成功メッセージを表示
      setSuccess('投稿が更新されました');
      
      // 3秒後に投稿詳細ページにリダイレクト
      setTimeout(() => {
        navigate(`/posts/${id}`);
      }, 3000);
    } catch (err) {
      console.error('投稿の更新に失敗しました', err);
      setError('投稿の更新に失敗しました。もう一度お試しください。');
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleCancel = () => {
    navigate(`/posts/${id}`);
  };
  
  if (loading) return <Loading />;
  
  if (!post) return null;
  
  return (
    <div className="container">
      <div className={styles.createPostPage}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>投稿の編集</h1>
          <Link to={`/posts/${id}`} className={styles.backButton}>
            ← 投稿に戻る
          </Link>
        </div>
        
        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}
        
        <div className={styles.formContainer}>
          <div className={styles.formHeader}>
            <h2 className={styles.formTitle}>投稿内容を編集</h2>
            <p className={styles.formDescription}>
              社内報に表示される内容です。適切なカテゴリを選択してください。
            </p>
          </div>
          
          <div className={styles.divider}></div>
          
          <PostForm
            initialValues={{
              title: post.title,
              content: post.content,
              headerImage: post.headerImage,
              categories: post.categories.map(category => category.name),
              isPinned: post.isPinned
            }}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={submitting}
            isEdit={true}
          />
        </div>
      </div>
    </div>
  );
};

export default EditPost;