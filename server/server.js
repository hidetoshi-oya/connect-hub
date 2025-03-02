const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// ミドルウェア
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 簡易ルート（テスト用）
app.get('/api', (req, res) => {
  res.json({ message: 'ConnectHub API is running!' });
});

// テスト用投稿エンドポイント
app.get('/api/posts', (req, res) => {
  // モックデータを返す
  res.json([
    {
      id: 1,
      title: '新しい社内報システムのβ版がリリースされました！',
      content: '長らくお待たせしました。本日より新しい社内報システム「ConnectHub」のβ版をリリースします。',
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
      content: '次期基幹システム開発プロジェクトのメンバーを募集します。興味のある方は詳細をご確認ください。',
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
    }
  ]);
});

// テスト用カテゴリエンドポイント
app.get('/api/categories', (req, res) => {
  res.json([
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
    { id: 12, name: 'IT部', description: 'IT部からの情報発信です', is_active: true }
  ]);
});

// テスト用認証エンドポイント
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // 簡易的な認証（テスト用）
  if (email === 'admin@example.com' && password === 'password') {
    res.json({
      token: 'test_token_for_admin',
      user: {
        id: 1,
        name: '管理者 太郎',
        email: 'admin@example.com',
        department: 'IT部',
        role: 'admin',
        avatar_url: '/avatars/admin.jpg'
      }
    });
  } else if (email === 'yamada@example.com' && password === 'password') {
    res.json({
      token: 'test_token_for_user',
      user: {
        id: 3,
        name: '山田 太郎',
        email: 'yamada@example.com',
        department: '営業部',
        role: 'contributor',
        avatar_url: '/avatars/yamada.jpg'
      }
    });
  } else {
    res.status(400).json({ message: 'メールアドレスまたはパスワードが正しくありません' });
  }
});

// サーバー起動
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
