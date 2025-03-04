const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const auth = require('../middlewares/auth');

// ユーザー一覧の取得 (管理者のみ)
router.get('/', auth.verifyToken, auth.isAdmin, userController.findAll);

// 自分のプロフィール情報取得
router.get('/me', auth.verifyToken, userController.getProfile);

// 特定のユーザー情報取得
router.get('/:id', userController.findOne);

// ユーザー情報更新 (自分自身のみ)
router.put('/me', auth.verifyToken, userController.updateProfile);

// ユーザーアバター画像アップロード
router.post('/avatar', auth.verifyToken, userController.uploadAvatar);

// ユーザーの投稿一覧取得
router.get('/:id/posts', userController.getUserPosts);

module.exports = router;
