const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const auth = require('../middlewares/auth');

// ユーザー登録
router.post('/register', authController.register);

// ログイン
router.post('/login', authController.login);

// ログアウト
router.post('/logout', auth.verifyToken, authController.logout);

// ユーザー情報の取得
router.get('/me', auth.verifyToken, authController.getProfile);

// パスワード変更
router.post('/change-password', auth.verifyToken, authController.changePassword);

module.exports = router;
