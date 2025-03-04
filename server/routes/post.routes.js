const express = require('express');
const router = express.Router();
const postController = require('../controllers/post.controller');
const auth = require('../middlewares/auth');

// 投稿一覧の取得
router.get('/', postController.findAll);

// 投稿の検索
router.get('/search', postController.search);

// 投稿の詳細取得
router.get('/:id', postController.findOne);

// 新規投稿の作成 (要認証)
router.post('/', auth.verifyToken, postController.create);

// 投稿の更新 (要認証)
router.put('/:id', auth.verifyToken, postController.update);

// 投稿の削除 (要認証)
router.delete('/:id', auth.verifyToken, postController.delete);

// いいねの追加/削除 (要認証)
router.post('/:id/like', auth.verifyToken, postController.toggleLike);

// カテゴリの追加/削除 (要認証)
router.post('/:id/categories', auth.verifyToken, postController.updateCategories);

// コメント関連
router.get('/:id/comments', postController.getComments);
router.post('/:id/comments', auth.verifyToken, postController.addComment);
router.delete('/:id/comments/:commentId', auth.verifyToken, postController.deleteComment);

module.exports = router;
