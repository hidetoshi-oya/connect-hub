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

// ミドルウェア
app.use(cors());
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

// データベース同期
db.sequelize.sync({ alter: true })
  .then(() => {
    console.log("データベース接続成功");
    
    // 初期データの作成（開発環境のみ）
    if (process.env.NODE_ENV === 'development') {
      require('./seeders')();
    }
  })
  .catch(err => {
    console.error("データベース接続エラー:", err);
  });

// サーバー起動
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
});
