const jwt = require('jsonwebtoken');
const db = require('../models');
const User = db.User;

// トークンを検証するミドルウェア
exports.verifyToken = async (req, res, next) => {
  try {
    // ヘッダーからトークンを取得
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN"形式を想定
    
    if (!token) {
      return res.status(401).json({
        message: '認証トークンが提供されていません'
      });
    }
    
    // トークンを検証
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // ユーザーが存在するか確認
    const user = await User.findByPk(decoded.id);
    
    if (!user) {
      return res.status(401).json({
        message: '無効なユーザーです'
      });
    }
    
    // リクエストにユーザーIDを追加
    req.userId = decoded.id;
    
    next();
  } catch (err) {
    console.error('トークン検証エラー:', err);
    
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        message: '認証トークンの有効期限が切れています'
      });
    }
    
    return res.status(401).json({
      message: '無効な認証トークンです'
    });
  }
};

// 管理者権限を確認するミドルウェア
exports.isAdmin = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    
    if (!user) {
      return res.status(401).json({
        message: 'ユーザーが見つかりません'
      });
    }
    
    if (user.role !== 'admin') {
      return res.status(403).json({
        message: 'この操作には管理者権限が必要です'
      });
    }
    
    next();
  } catch (err) {
    console.error('権限確認エラー:', err);
    return res.status(500).json({
      message: '権限の確認中にエラーが発生しました'
    });
  }
};
