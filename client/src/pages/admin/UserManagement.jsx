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
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    marginRight: '0.5rem',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
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
  searchContainer: {
    marginBottom: '1.5rem',
  },
  searchInput: {
    padding: '0.5rem',
    width: '300px',
    border: '1px solid #ced4da',
    borderRadius: '4px',
  },
  filterContainer: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  filterSelect: {
    padding: '0.5rem',
    border: '1px solid #ced4da',
    borderRadius: '4px',
  },
  badge: {
    display: 'inline-block',
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    fontSize: '0.75rem',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  badgeAdmin: {
    backgroundColor: '#d9534f',
    color: 'white',
  },
  badgeModerator: {
    backgroundColor: '#f0ad4e',
    color: 'white',
  },
  badgeContributor: {
    backgroundColor: '#5cb85c',
    color: 'white',
  },
  badgeViewer: {
    backgroundColor: '#5bc0de',
    color: 'white',
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '1.5rem',
  },
  pageItem: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '2rem',
    height: '2rem',
    margin: '0 0.25rem',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  pageItemActive: {
    backgroundColor: '#4a90e2',
    color: 'white',
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
};

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  
  const usersPerPage = 10;
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        
        // 実際はAPIを呼び出してユーザー一覧を取得する
        // const response = await axios.get('/api/admin/users');
        
        // モックデータ
        const mockUsers = [
          {
            id: 1,
            name: '管理者 太郎',
            email: 'admin@example.com',
            department: 'IT部',
            role: 'admin',
            avatar_url: '/avatars/admin.jpg',
            created_at: '2023-01-01T00:00:00Z'
          },
          {
            id: 2,
            name: 'モデレータ 花子',
            email: 'moderator@example.com',
            department: '人事部',
            role: 'moderator',
            avatar_url: '/avatars/moderator.jpg',
            created_at: '2023-01-02T00:00:00Z'
          },
          {
            id: 3,
            name: '山田 太郎',
            email: 'yamada@example.com',
            department: '営業部',
            role: 'contributor',
            avatar_url: '/avatars/yamada.jpg',
            created_at: '2023-01-03T00:00:00Z'
          },
          {
            id: 4,
            name: '鈴木 一郎',
            email: 'suzuki@example.com',
            department: '開発部',
            role: 'contributor',
            avatar_url: '/avatars/default.jpg',
            created_at: '2023-01-04T00:00:00Z'
          },
          {
            id: 5,
            name: '佐藤 二郎',
            email: 'sato@example.com',
            department: 'マーケティング部',
            role: 'viewer',
            avatar_url: '/avatars/default.jpg',
            created_at: '2023-01-05T00:00:00Z'
          }
        ];
        
        setUsers(mockUsers);
      } catch (err) {
        console.error('ユーザー一覧の取得に失敗しました', err);
        setError('ユーザー一覧の取得に失敗しました。もう一度お試しください。');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []);
  
  const handleEdit = (user) => {
    setCurrentUser(user);
    setShowModal(true);
  };
  
  const handleSave = async (e) => {
    e.preventDefault();
    
    // 実際はAPIを呼び出してユーザー情報を更新する
    // await axios.put(`/api/admin/users/${currentUser.id}`, currentUser);
    
    // モックの更新処理
    setUsers(users.map(user => user.id === currentUser.id ? currentUser : user));
    setShowModal(false);
  };
  
  const handleDelete = async (userId) => {
    if (!window.confirm('本当にこのユーザーを削除しますか？')) {
      return;
    }
    
    try {
      // 実際はAPIを呼び出してユーザーを削除する
      // await axios.delete(`/api/admin/users/${userId}`);
      
      // モックの削除処理
      setUsers(users.filter(user => user.id !== userId));
    } catch (err) {
      console.error('ユーザーの削除に失敗しました', err);
      setError('ユーザーの削除に失敗しました。もう一度お試しください。');
    }
  };
  
  // 検索とフィルタリング
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesDepartment = departmentFilter === 'all' || user.department === departmentFilter;
    
    return matchesSearch && matchesRole && matchesDepartment;
  });
  
  // ページネーション
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  // 部署の一覧（重複を除去）
  const departments = ['all', ...new Set(users.map(user => user.department))];
  
  return (
    <div className="container" style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>ユーザー管理</h1>
        <Link to="/" style={styles.backLink}>
          ← ホームに戻る
        </Link>
      </div>
      
      {error && <div style={{ color: '#d9534f', marginBottom: '1rem' }}>{error}</div>}
      
      <div style={styles.searchContainer}>
        <input
          type="text"
          placeholder="ユーザー名またはメールアドレスで検索"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
      </div>
      
      <div style={styles.filterContainer}>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          style={styles.filterSelect}
        >
          <option value="all">全てのロール</option>
          <option value="admin">管理者</option>
          <option value="moderator">モデレーター</option>
          <option value="contributor">投稿者</option>
          <option value="viewer">閲覧者</option>
        </select>
        
        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          style={styles.filterSelect}
        >
          {departments.map((department, index) => (
            <option key={index} value={department}>
              {department === 'all' ? '全ての部署' : department}
            </option>
          ))}
        </select>
        
        <button 
          style={styles.addButton}
          onClick={() => {
            setCurrentUser({
              id: '',
              name: '',
              email: '',
              department: 'IT部',
              role: 'viewer',
              avatar_url: '/avatars/default.jpg'
            });
            setShowModal(true);
          }}
        >
          + 新規ユーザー追加
        </button>
      </div>
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>読み込み中...</div>
      ) : (
        <>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ユーザー</th>
                <th style={styles.th}>メールアドレス</th>
                <th style={styles.th}>部署</th>
                <th style={styles.th}>ロール</th>
                <th style={styles.th}>操作</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map(user => (
                <tr key={user.id}>
                  <td style={styles.td}>
                    <div style={styles.userInfo}>
                      <img
                        src={user.avatar_url || '/avatars/default.jpg'}
                        alt={user.name}
                        style={styles.avatar}
                      />
                      <span>{user.name}</span>
                    </div>
                  </td>
                  <td style={styles.td}>{user.email}</td>
                  <td style={styles.td}>{user.department}</td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.badge,
                      ...(user.role === 'admin' ? styles.badgeAdmin : 
                          user.role === 'moderator' ? styles.badgeModerator :
                          user.role === 'contributor' ? styles.badgeContributor :
                          styles.badgeViewer)
                    }}>
                      {user.role === 'admin' ? '管理者' :
                       user.role === 'moderator' ? 'モデレーター' :
                       user.role === 'contributor' ? '投稿者' : '閲覧者'}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <div style={styles.actions}>
                      <button
                        style={styles.editButton}
                        onClick={() => handleEdit(user)}
                      >
                        編集
                      </button>
                      <button
                        style={styles.deleteButton}
                        onClick={() => handleDelete(user.id)}
                      >
                        削除
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* ページネーション */}
          {totalPages > 1 && (
            <div style={styles.pagination}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                <div
                  key={number}
                  style={{
                    ...styles.pageItem,
                    ...(number === currentPage ? styles.pageItemActive : {})
                  }}
                  onClick={() => paginate(number)}
                >
                  {number}
                </div>
              ))}
            </div>
          )}
        </>
      )}
      
      {/* ユーザー編集/追加モーダル */}
      {showModal && currentUser && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>
                {currentUser.id ? 'ユーザー編集' : '新規ユーザー追加'}
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
                <label style={styles.formLabel} htmlFor="name">名前</label>
                <input
                  id="name"
                  type="text"
                  value={currentUser.name}
                  onChange={(e) => setCurrentUser({ ...currentUser, name: e.target.value })}
                  style={styles.formControl}
                  required
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.formLabel} htmlFor="email">メールアドレス</label>
                <input
                  id="email"
                  type="email"
                  value={currentUser.email}
                  onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
                  style={styles.formControl}
                  required
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.formLabel} htmlFor="department">部署</label>
                <select
                  id="department"
                  value={currentUser.department}
                  onChange={(e) => setCurrentUser({ ...currentUser, department: e.target.value })}
                  style={styles.formControl}
                  required
                >
                  <option value="IT部">IT部</option>
                  <option value="営業部">営業部</option>
                  <option value="開発部">開発部</option>
                  <option value="人事部">人事部</option>
                  <option value="広報部">広報部</option>
                  <option value="マーケティング部">マーケティング部</option>
                </select>
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.formLabel} htmlFor="role">ロール</label>
                <select
                  id="role"
                  value={currentUser.role}
                  onChange={(e) => setCurrentUser({ ...currentUser, role: e.target.value })}
                  style={styles.formControl}
                  required
                >
                  <option value="admin">管理者</option>
                  <option value="moderator">モデレーター</option>
                  <option value="contributor">投稿者</option>
                  <option value="viewer">閲覧者</option>
                </select>
              </div>
              
              {!currentUser.id && (
                <div style={styles.formGroup}>
                  <label style={styles.formLabel} htmlFor="password">初期パスワード</label>
                  <input
                    id="password"
                    type="password"
                    onChange={(e) => setCurrentUser({ ...currentUser, password: e.target.value })}
                    style={styles.formControl}
                    required
                  />
                </div>
              )}
              
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

export default UserManagement;
