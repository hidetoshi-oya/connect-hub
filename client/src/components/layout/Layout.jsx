import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import styles from './Layout.module.css';

const Layout = () => {
  return (
    <div className={styles.appContainer}>
      <Header />
      <div className={styles.mainContent}>
        <Sidebar />
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;