import React from 'react';

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem',
  },
  spinner: {
    display: 'inline-block',
    width: '50px',
    height: '50px',
    border: '5px solid rgba(74, 144, 226, 0.1)',
    borderRadius: '50%',
    borderTop: '5px solid #4a90e2',
    animation: 'spin 1s linear infinite',
  },
  '@keyframes spin': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
  },
};

const Loading = () => {
  // スタイルにアニメーションを適用するためのCSS
  React.useEffect(() => {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(styleSheet);
    
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);
  
  return (
    <div style={styles.container}>
      <div style={styles.spinner}></div>
    </div>
  );
};

export default Loading;
