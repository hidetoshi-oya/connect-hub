const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment.controller');
const auth = require('../middlewares/auth');

// コメント一覧の取得
router.get('/', commentController.findAll);

// 特定のコメント取得
router.get('/:id', commentController.findOne);

// コメントの更新 (要認証)
router.put('/:id', auth.verifyToken, commentController.update);

// コメントの削除 (要認証)
router.delete('/:id', auth.verifyToken, commentController.delete);

module.exports = router;
