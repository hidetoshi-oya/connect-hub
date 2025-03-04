const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const auth = require('../middlewares/auth');

// カテゴリ一覧の取得
router.get('/', categoryController.findAll);

// カテゴリの詳細取得
router.get('/:id', categoryController.findOne);

// 新規カテゴリの作成 (要管理者権限)
router.post('/', [auth.verifyToken, auth.isAdmin], categoryController.create);

// カテゴリの更新 (要管理者権限)
router.put('/:id', [auth.verifyToken, auth.isAdmin], categoryController.update);

// カテゴリの削除 (要管理者権限)
router.delete('/:id', [auth.verifyToken, auth.isAdmin], categoryController.delete);

// カテゴリに属する投稿一覧の取得
router.get('/:id/posts', categoryController.getPosts);

module.exports = router;
