import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerInfo}>
          <div className={styles.footerLogo}>
            ConnectHub
          </div>
          <p>部署間交流とエンゲージメント向上のための社内報システム</p>
        </div>
        
        <div className={styles.footerLinks}>
          <div className={styles.linkGroup}>
            <h4>サイト</h4>
            <ul>
              <li><Link to="/">ホーム</Link></li>
              <li><Link to="/?pinned=true">ピン留め投稿</Link></li>
              <li><Link to="/posts/create">新規投稿</Link></li>
            </ul>
          </div>
          
          <div className={styles.linkGroup}>
            <h4>サポート</h4>
            <ul>
              <li><Link to="/help">ヘルプ</Link></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); window.open('/feedback', 'feedback', 'width=500,height=600'); }}>フィードバック</a></li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className={styles.footerBottom}>
        <p>&copy; {currentYear} 株式会社〇〇 All Rights Reserved.</p>
        <p>ConnectHub β版</p>
      </div>
    </footer>
  );
};

export default Footer;