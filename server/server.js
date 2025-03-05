const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./swagger');
const db = require('./models');

// ルーターのインポート
const authRoutes = require('./routes/auth.routes');
const postRoutes = require('./routes/post.routes');
const categoryRoutes = require('./routes/category.routes');
const userRoutes = require('./routes/user.routes');
const commentRoutes = require('./routes/comment.routes');
const adminRoutes = require('./routes/admin.routes');

dotenv.config();

const app = express();

// CORSの設定を詳細に構成
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:8000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// ミドルウェア
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger UIを設定
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// APIルートを設定
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/admin', adminRoutes);

/**
 * @swagger
 * /api:
 *   get:
 *     summary: APIのステータスを確認
 *     description: APIが正常に動作しているか確認するための簡易エンドポイント
 *     tags: [Status]
 *     responses:
 *       200:
 *         description: APIが正常に動作している
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'ConnectHub API is running!'
 */
app.get('/api', (req, res) => {
  res.json({ message: 'ConnectHub API is running!' });
});

// サーバー起動
const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
  
  // データベース接続を試行
  connectToDatabase();
});

// データベース接続関数
async function connectToDatabase() {
  const maxRetries = 10;
  let retries = 0;
  let connected = false;
  
  while (retries < maxRetries && !connected) {
    try {
      console.log(`データベース接続を試行中... (${retries + 1}/${maxRetries})`);
      await db.sequelize.authenticate();
      console.log("データベース接続に成功しました！");
      connected = true;
      
      // 開発環境では注意してスキーマを同期する
      // 本番環境では force: false かつ alter: false が安全
      // 初回起動時のみ alter: true で実行
      try {
        await db.sequelize.sync({ force: false, alter: false });
        console.log("データベースの同期が完了しました");
      } catch (syncError) {
        console.error("データベース同期中にエラーが発生しました:", syncError.message);
      }
      
      // 初期データの作成（開発環境のみ）
      if (process.env.NODE_ENV === 'development') {
        try {
          await require('./seeders')();
        } catch (seedError) {
          console.error("初期データの作成中にエラーが発生しました:", seedError);
        }
      }
    } catch (error) {
      retries++;
      console.error(`データベース接続に失敗しました (${retries}/${maxRetries}):`, error.message);
      
      if (retries >= maxRetries) {
        console.error("最大再試行回数に達しました。データベース接続を確立できませんでした。");
        console.error("サーバーを終了します...");
        server.close(() => {
          process.exit(1);
        });
        return;
      }
      
      // 次の再試行までの待機時間を設定（指数バックオフ）
      const waitTime = Math.min(1000 * Math.pow(1.5, retries), 30000);
      console.log(`${waitTime / 1000}秒後に再試行します...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
}

// プロセス終了ハンドリング
process.on('SIGINT', () => {
  console.log('サーバーをシャットダウンしています...');
  server.close(() => {
    console.log('サーバーが正常にシャットダウンされました');
    process.exit(0);
  });
});
