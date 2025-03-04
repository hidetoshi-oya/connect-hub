import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

// スタイル - 将来的にはモジュールCSSを作成
const styles = {
  card: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    overflow: 'hidden',
  },
  cardHover: {
    transform: 'translateY(-3px)',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  pinnedCard: {
    borderLeft: '4px solid #f0ad4e',
  },
  headerImage: {
    width: '100%',
    height: '180px',
    objectFit: 'cover',
    borderTopLeftRadius: '8px',
    borderTopRightRadius: '8px',
  },
  contentWrapper: {
    padding: '1.5rem',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '1rem',
  },
  title: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    marginTop: 0,
    marginBottom: '0.5rem',
    color: '#212529',
  },
  meta: {
    display: 'flex',
    alignItems: 'center',
    color: '#6c757d',
    fontSize: '0.9rem',
    flexWrap: 'wrap',
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
    marginTop: '0.5rem',
    flexWrap: 'wrap',
  },
  category: {
    backgroundColor: '#e9ecef',
    color: '#212529',
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    fontSize: '0.8rem',
  },
  content: {
    marginBottom: '1rem',
    color: '#4a5568',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
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
  },
  pinnedIndicator: {
    display: 'flex',
    alignItems: 'center',
    color: '#f0ad4e',
    fontSize: '0.9rem',
    marginBottom: '0.5rem',
  },
};

const PostCard = ({ post, currentUser }) => {
  const [hover, setHover] = React.useState(false);
  
  const formattedDate = format(new Date(post.created_at), 'yyyy年MM月dd日', { locale: ja });
  
  const truncateContent = (text, maxLength = 150) => {
    if (!text) return '';

    // Markdownの記法を取り除く（簡易的な実装）
    let plainText = text
      .replace(/!\[.*?\]\(.*?\)/g, '[画像]') // 画像を[画像]テキストに置換
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
    <Link to={`/posts/${post.id}`} style={styles.link}>
      <div
        style={{
          ...styles.card,
          ...(hover ? styles.cardHover : {}),
          ...(post.isPinned ? styles.pinnedCard : {})
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {post.headerImage && (
          <img
            src={post.headerImage}
            alt={post.title}
            style={styles.headerImage}
          />
        )}
        
        <div style={styles.contentWrapper}>
          {post.isPinned && (
            <div style={styles.pinnedIndicator}>
              <span style={{ marginRight: '0.25rem' }}>📌</span>
              固定投稿
            </div>
          )}
          
          <div style={styles.header}>
            <h3 style={styles.title}>{post.title}</h3>
          </div>
          
          <div style={styles.meta}>
            <div style={styles.author}>
              <img
                src={post.author.avatar_url || '/default-avatar.png'}
                alt={post.author.name}
                style={styles.authorAvatar}
              />
              <span>{post.author.name}</span>
            </div>
            <div style={styles.date}>{formattedDate}</div>
            <div style={styles.department}>{post.author.department}</div>
          </div>
          
          <div style={styles.categories}>
            {post.categories.map((category, index) => (
              <span key={index} style={styles.category}>
                {category.name}
              </span>
            ))}
          </div>
          
          <div style={styles.content}>
            {truncateContent(post.content)}
          </div>
          
          <div style={styles.footer}>
            <div style={styles.stats}>
              <div style={styles.stat}>
                <span style={styles.icon}>👍</span>
                {post.likes.length}
              </div>
              <div style={styles.stat}>
                <span style={styles.icon}>💬</span>
                {post.comments.length}
              </div>
            </div>
            
            <div style={styles.readMore}>
              続きを読む
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PostCard;
