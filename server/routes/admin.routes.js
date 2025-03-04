const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const auth = require('../middlewares/auth');

// 管理者権限が必要なルート
router.use(auth.verifyToken, auth.isAdmin);

// ダッシュボード統計情報
router.get('/dashboard', adminController.getDashboardStats);

// ユーザー管理
router.get('/users', adminController.getAllUsers);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);

// カテゴリ管理
router.post('/categories', adminController.createCategory);
router.put('/categories/:id', adminController.updateCategory);
router.delete('/categories/:id', adminController.deleteCategory);

// 投稿管理
router.get('/posts', adminController.getAllPosts);
router.put('/posts/:id', adminController.updatePost);
router.delete('/posts/:id', adminController.deletePost);

module.exports = router;
