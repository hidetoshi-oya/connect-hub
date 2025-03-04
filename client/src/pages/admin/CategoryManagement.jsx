import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// スタイル - 将来的にはモジュールCSSを作成
const styles = {
  container: {
    padding: '2rem 0',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
  },
  title: {
    fontSize: '2rem',
    margin: 0,
  },
  backLink: {
    display: 'inline-flex',
    alignItems: 'center',
    color: '#4a90e2',
    textDecoration: 'none',
  },
  addButton: {
    display: 'inline-flex',
    alignItems: 'center',
    backgroundColor: '#5cb85c',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '0.5rem 1rem',
    cursor: 'pointer',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: 'white',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  th: {
    textAlign: 'left',
    padding: '1rem',
    borderBottom: '1px solid #e9ecef',
    backgroundColor: '#f8f9fa',
  },
  td: {
    padding: '1rem',
    borderBottom: '1px solid #e9ecef',
  },
  actions: {
    display: 'flex',
    gap: '0.5rem',
  },
  editButton: {
    backgroundColor: '#4a90e2',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '0.25rem 0.5rem',
    cursor: 'pointer',
  },
  deleteButton: {
    backgroundColor: '#d9534f',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '0.25rem 0.5rem',
    cursor: 'pointer',
  },
  status: {
    display: 'inline-block',
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    marginRight: '0.5rem',
  },
  statusActive: {
    backgroundColor: '#5cb85c',
  },
  statusInactive: {
    backgroundColor: '#d9534f',
  },
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    width: '500px',
    maxWidth: '90%',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  modalTitle: {
    fontSize: '1.5rem',
    margin: 0,
  },
  modalCloseButton: {
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
  },
  form: {
    marginBottom: '1rem',
  },
  formGroup: {
    marginBottom: '1rem',
  },
  formLabel: {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: 'bold',
  },
  formControl: {
    width: '100%',
    padding: '0.5rem',
    border: '1px solid #ced4da',
    borderRadius: '4px',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '0.5rem',
  },
  cancelButton: {
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '0.5rem 1rem',
    cursor: 'pointer',
  },
  saveButton: {
    backgroundColor: '#5cb85c',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '0.5rem 1rem',
    cursor: 'pointer',
  },
  searchContainer: {
    marginBottom: '1.5rem',
  },
  searchInput: {
    padding: '0.5rem',
    width: '300px',
    border: '1px solid #ced4da',
    borderRadius: '4px',
  },
  switchContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  switch: {
    position: 'relative',
    display: 'inline-block',
    width: '40px',
    height: '24px',
  },
  switchInput: {
    opacity: 0,
    width: 0,
    height: 0,
  },
  switchSlider: {
    position: 'absolute',
    cursor: 'pointer',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#ccc',
    transition: '0.4s',
    borderRadius: '24px',
  },
  switchSliderActive: {
    backgroundColor: '#5cb85c',
  },
  switchSliderBefore: {
    position: 'absolute',
    content: '',
    height: '16px',
    width: '16px',
    left: '4px',
    bottom: '4px',
    backgroundColor: 'white',
    transition: '0.4s',
    borderRadius: '50%',
  },
  switchSliderBeforeActive: {
    transform: 'translateX(16px)',
  },
};

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        
        // 実際はAPIを呼び出してカテゴリ一覧を取得する
        // const response = await axios.get('/api/admin/categories');
        
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
          { id: 12, name: 'IT部', description: 'IT部からの情報発信です', is_active: true },
          { id: 13, name: '旧部署', description: '組織変更前の旧部署のアーカイブ記事です', is_active: false }
        ];
        
        setCategories(mockCategories);
      } catch (err) {
        console.error('カテゴリ一覧の取得に失敗しました', err);
        setError('カテゴリ一覧の取得に失敗しました。もう一度お試しください。');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategories();
  }, []);
  
  const handleEdit = (category) => {
    setCurrentCategory(category);
    setShowModal(true);
  };
  
  const handleSave = async (e) => {
    e.preventDefault();
    
    // 実際はAPIを呼び出してカテゴリ情報を更新する
    // await axios.put(`/api/admin/categories/${currentCategory.id}`, currentCategory);
    
    // モックの更新処理
    setCategories(categories.map(category => 
      category.id === currentCategory.id ? currentCategory : category
    ));
    setShowModal(false);
  };
  
  const handleDelete = async (categoryId) => {
    if (!window.confirm('本当にこのカテゴリを削除しますか？関連する投稿のカテゴリ情報も削除されます。')) {
      return;
    }
    
    try {
      // 実際はAPIを呼び出してカテゴリを削除する
      // await axios.delete(`/api/admin/categories/${categoryId}`);
      
      // モックの削除処理
      setCategories(categories.filter(category => category.id !== categoryId));
    } catch (err) {
      console.error('カテゴリの削除に失敗しました', err);
      setError('カテゴリの削除に失敗しました。もう一度お試しください。');
    }
  };
  
  const handleToggleActive = async (categoryId) => {
    try {
      // カテゴリのアクティブ状態を更新
      const updatedCategories = categories.map(category => {
        if (category.id === categoryId) {
          return { ...category, is_active: !category.is_active };
        }
        return category;
      });
      
      // 実際はAPIを呼び出してカテゴリのアクティブ状態を更新する
      // await axios.patch(`/api/admin/categories/${categoryId}`, { is_active: !category.is_active });
      
      setCategories(updatedCategories);
    } catch (err) {
      console.error('カテゴリのステータス更新に失敗しました', err);
      setError('カテゴリのステータス更新に失敗しました。もう一度お試しください。');
    }
  };
  
  // 検索とフィルタリング
  const filteredCategories = categories.filter(category => {
    const matchesSearch = 
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesActive = !showActiveOnly || category.is_active;
    
    return matchesSearch && matchesActive;
  });
  
  return (
    <div className="container" style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>カテゴリ管理</h1>
        <Link to="/" style={styles.backLink}>
          ← ホームに戻る
        </Link>
      </div>
      
      {error && <div style={{ color: '#d9534f', marginBottom: '1rem' }}>{error}</div>}
      
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div style={styles.searchContainer}>
          <input
            type="text"
            placeholder="カテゴリ名や説明で検索"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={styles.switchContainer}>
            <label style={styles.switch}>
              <input
                type="checkbox"
                checked={showActiveOnly}
                onChange={() => setShowActiveOnly(!showActiveOnly)}
                style={styles.switchInput}
              />
              <span style={{
                ...styles.switchSlider,
                ...(showActiveOnly ? styles.switchSliderActive : {})
              }}>
                <span style={{
                  ...styles.switchSliderBefore,
                  ...(showActiveOnly ? styles.switchSliderBeforeActive : {})
                }}></span>
              </span>
            </label>
            <span style={{ marginLeft: '0.5rem' }}>アクティブのみ表示</span>
          </div>
          
          <button 
            style={styles.addButton}
            onClick={() => {
              setCurrentCategory({
                id: '',
                name: '',
                description: '',
                is_active: true
              });
              setShowModal(true);
            }}
          >
            + 新規カテゴリ追加
          </button>
        </div>
      </div>
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>読み込み中...</div>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ステータス</th>
              <th style={styles.th}>カテゴリ名</th>
              <th style={styles.th}>説明</th>
              <th style={styles.th}>操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.map(category => (
              <tr key={category.id}>
                <td style={styles.td}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{
                      ...styles.status,
                      ...(category.is_active ? styles.statusActive : styles.statusInactive)
                    }}></span>
                    {category.is_active ? 'アクティブ' : '非アクティブ'}
                  </div>
                </td>
                <td style={styles.td}>{category.name}</td>
                <td style={styles.td}>{category.description}</td>
                <td style={styles.td}>
                  <div style={styles.actions}>
                    <button
                      style={styles.editButton}
                      onClick={() => handleEdit(category)}
                    >
                      編集
                    </button>
                    <button
                      style={{
                        ...styles.editButton,
                        backgroundColor: category.is_active ? '#f0ad4e' : '#5cb85c'
                      }}
                      onClick={() => handleToggleActive(category.id)}
                    >
                      {category.is_active ? '無効化' : '有効化'}
                    </button>
                    <button
                      style={styles.deleteButton}
                      onClick={() => handleDelete(category.id)}
                    >
                      削除
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      
      {/* カテゴリ編集/追加モーダル */}
      {showModal && currentCategory && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>
                {currentCategory.id ? 'カテゴリ編集' : '新規カテゴリ追加'}
              </h2>
              <button
                style={styles.modalCloseButton}
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>
            
            <form style={styles.form} onSubmit={handleSave}>
              <div style={styles.formGroup}>
                <label style={styles.formLabel} htmlFor="name">カテゴリ名</label>
                <input
                  id="name"
                  type="text"
                  value={currentCategory.name}
                  onChange={(e) => setCurrentCategory({ ...currentCategory, name: e.target.value })}
                  style={styles.formControl}
                  required
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.formLabel} htmlFor="description">説明</label>
                <textarea
                  id="description"
                  value={currentCategory.description}
                  onChange={(e) => setCurrentCategory({ ...currentCategory, description: e.target.value })}
                  style={{ ...styles.formControl, minHeight: '100px', resize: 'vertical' }}
                  required
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    checked={currentCategory.is_active}
                    onChange={(e) => setCurrentCategory({ ...currentCategory, is_active: e.target.checked })}
                    style={{ marginRight: '0.5rem' }}
                  />
                  アクティブ（投稿時に選択可能）
                </label>
              </div>
              
              <div style={styles.buttonGroup}>
                <button
                  type="button"
                  style={styles.cancelButton}
                  onClick={() => setShowModal(false)}
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  style={styles.saveButton}
                >
                  保存
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;
