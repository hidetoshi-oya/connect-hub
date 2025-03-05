import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import LikeButton from './LikeButton';

// スタイル
const styles = {
  card: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    display: 'flex',
    overflow: 'hidden',
    marginBottom: '1rem',
  },
  cardHover: {
    transform: 'translateY(-3px)',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  pinnedCard: {
    borderLeft: '4px solid #f0ad4e',
  },
  imageContainer: {
    flex: '0 0 200px',
    height: '100%', // 高さを100%に変更して親要素に合わせる
    display: 'flex', // flexboxを追加
    alignItems: 'stretch', // 子要素を縦方向に引き伸ばす
  },
  headerImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block', // 画像の下部の隙間を除去
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    backgroundColor: '#e9ecef',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#6c757d',
    fontSize: '0.9rem',
  },
  contentWrapper: {
    flex: '1',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    marginTop: 0,
    marginBottom: '0.75rem',
    color: '#212529',
  },
  metaContainer: {
    marginBottom: 'auto',
  },
  meta: {
    display: 'flex',
    alignItems: 'center',
    color: '#6c757d',
    fontSize: '0.9rem',
    flexWrap: 'wrap',
    marginBottom: '0.5rem',
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
    flexWrap: 'wrap',
  },
  category: {
    backgroundColor: '#e9ecef',
    color: '#212529',
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    fontSize: '0.8rem',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '1rem',
  },
  stats: {
    display: 'flex',
    gap: '1rem',
    color: '#6c757d',
    fontSize: '0.9rem',
  },
  stat: {
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    marginRight: '0.25rem',
  },
  readMore: {
    display: 'inline-flex',
    alignItems: 'center',
    color: '#4a90e2',
    textDecoration: 'none',
    fontSize: '0.9rem',
  },
  link: {
    textDecoration: 'none',
    display: 'block',
    width: '100%',
  },
  pinnedIndicator: {
    display: 'flex',
    alignItems: 'center',
    color: '#f0ad4e',
    fontSize: '0.9rem',
    marginBottom: '0.5rem',
  },
  likeButtonContainer: {
    display: 'flex',
    alignItems: 'center',
    marginRight: '1rem',
  },
  commentCount: {
    display: 'flex',
    alignItems: 'center',
  }
};

const PostCard = ({ post, currentUser, onUpdate }) => {
  const [hover, setHover] = useState(false);
  const [updatedPost, setUpdatedPost] = useState(post);
  
  // フォーマット済みの作成日付
  const formattedDate = format(new Date(updatedPost.created_at), 'yyyy年MM月dd日', { locale: ja });
  
  // 投稿の更新が発生した場合
  const handlePostUpdate = (updates) => {
    const newPostData = { ...updatedPost, ...updates };
    setUpdatedPost(newPostData);
    
    // 親コンポーネントのonUpdateが存在する場合呼び出し
    if (onUpdate) {
      onUpdate(updatedPost.id, updates);
    }
  };
  
  // LikeButtonからの更新を処理
  const handleLikeUpdate = (updates) => {
    handlePostUpdate(updates);
  };
  
  // コンテンツの切り詰め
  const truncateContent = (text, maxLength = 150) => {
    if (!text) return '';

    // Markdownの記法を取り除く（簡易的な実装）
    let plainText = text
      .replace(/!\[(.*?)\]\((.*?)\)/g, '[画像]') // 画像を[画像]テキストに置換
      .replace(/\*\*(.*?)\*\*/g, '$1')      // 太字を通常テキストに変換
      .replace(/\*(.*?)\*/g, '$1')          // イタリックを通常テキストに変換
      .replace(/__(.*?)__/g, '$1')          // 下線を通常テキストに変換
      .replace(/^##\s+(.*)$/gm, '$1')       // 見出し2を通常テキストに変換
      .replace(/^###\s+(.*)$/gm, '$1')      // 見出し3を通常テキストに変換
      .replace(/^-\s+(.*)$/gm, '$1');       // リストを通常テキストに変換

    if (plainText.length <= maxLength) return plainText;
    return plainText.slice(0, maxLength) + '...';
  };
  
  return (
    <div className="post-card-container">
      <Link to={`/posts/${updatedPost.id}`} style={styles.link}>
        <div
          style={{
            ...styles.card,
            ...(hover ? styles.cardHover : {}),
            ...(updatedPost.isPinned ? styles.pinnedCard : {})
          }}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          <div style={styles.imageContainer}>
            {updatedPost.headerImage ? (
              <img
                src={updatedPost.headerImage}
                alt={updatedPost.title}
                style={styles.headerImage}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/200x200?text=画像が見つかりません';
                }}
              />
            ) : (
              <div style={styles.placeholderImage}>
                No Image
              </div>
            )}
          </div>
          
          <div style={styles.contentWrapper}>
            {updatedPost.isPinned && (
              <div style={styles.pinnedIndicator}>
                <span style={{ marginRight: '0.25rem' }}>📌</span>
                固定投稿
              </div>
            )}
            
            <h3 style={styles.title}>{updatedPost.title}</h3>
            
            <div style={styles.metaContainer}>
              <div style={styles.meta}>
                <div style={styles.author}>
                  <img
                    src={updatedPost.author.avatar_url || '/default-avatar.png'}
                    alt={updatedPost.author.name}
                    style={styles.authorAvatar}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/default-avatar.png';
                    }}
                  />
                  <span>{updatedPost.author.name}</span>
                </div>
                <div style={styles.date}>{formattedDate}</div>
                <div style={styles.department}>{updatedPost.author.department}</div>
              </div>
              
              <div style={styles.categories}>
                {updatedPost.categories.map((category, index) => (
                  <span key={index} style={styles.category}>
                    {category.name}
                  </span>
                ))}
              </div>
            </div>
            
            <div style={styles.footer}>
              <div style={styles.stats}>
                <div style={styles.likeButtonContainer} onClick={(e) => e.preventDefault()}>
                  <LikeButton
                    postId={updatedPost.id}
                    likes={updatedPost.likes}
                    currentUser={currentUser}
                    onUpdate={handleLikeUpdate}
                  />
                </div>
                <div style={styles.commentCount}>
                  <span style={styles.icon}>💬</span>
                  {updatedPost.comments_count || (updatedPost.comments && updatedPost.comments.length) || 0}
                </div>
              </div>
              
              <div style={styles.readMore}>
                続きを読む
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default PostCard;