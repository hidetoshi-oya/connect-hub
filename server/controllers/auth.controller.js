const db = require('../models');
const User = db.User;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// ユーザー登録
exports.register = async (req, res) => {
  try {
    const { name, email, password, department } = req.body;
    
    // メールアドレスの重複チェック
    const existingUser = await User.findOne({
      where: { email }
    });
    
    if (existingUser) {
      return res.status(400).json({
        message: 'このメールアドレスは既に使用されています'
      });
    }
    
    // パスワードのハッシュ化
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // ユーザーを作成
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      department,
      role: 'contributor' // デフォルトロール
    });
    
    // JWTトークンの生成
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || 'your_jwt_secret_key',
      { expiresIn: '24h' }
    );
    
    // レスポンス用にユーザー情報を整形
    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      department: user.department,
      role: user.role,
      avatar_url: user.avatar_url
    };
    
    return res.status(201).json({
      message: 'ユーザー登録が完了しました',
      token,
      user: userResponse
    });
  } catch (err) {
    console.error('ユーザー登録に失敗:', err);
    return res.status(500).json({
      message: 'ユーザー登録中にエラーが発生しました'
    });
  }
};

// ログイン
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // ユーザーを検索
    const user = await User.findOne({
      where: { email }
    });
    
    if (!user) {
      return res.status(401).json({
        message: 'メールアドレスまたはパスワードが正しくありません'
      });
    }
    
    // アカウントの有効性をチェック
    if (!user.is_active) {
      return res.status(403).json({
        message: 'このアカウントは無効化されています'
      });
    }
    
    // パスワードを検証
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'メールアドレスまたはパスワードが正しくありません'
      });
    }
    
    // JWTトークンの生成
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || 'your_jwt_secret_key',
      { expiresIn: '24h' }
    );
    
    // レスポンス用にユーザー情報を整形
    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      department: user.department,
      role: user.role,
      avatar_url: user.avatar_url
    };
    
    return res.json({
      token,
      user: userResponse
    });
  } catch (err) {
    console.error('ログインに失敗:', err);
    return res.status(500).json({
      message: 'ログイン処理中にエラーが発生しました'
    });
  }
};

// ログアウト (クライアント側でトークンを削除するだけなのでサーバー側の処理は最小限)
exports.logout = (req, res) => {
  return res.json({
    message: 'ログアウトしました'
  });
};

// ユーザープロフィールの取得
exports.getProfile = async (req, res) => {
  try {
    const userId = req.userId;
    
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(404).json({
        message: 'ユーザーが見つかりません'
      });
    }
    
    return res.json(user);
  } catch (err) {
    console.error('プロフィール取得に失敗:', err);
    return res.status(500).json({
      message: 'プロフィール取得中にエラーが発生しました'
    });
  }
};

// パスワード変更
exports.changePassword = async (req, res) => {
  try {
    const userId = req.userId;
    const { currentPassword, newPassword } = req.body;
    
    // ユーザーを取得
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({
        message: 'ユーザーが見つかりません'
      });
    }
    
    // 現在のパスワードを検証
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        message: '現在のパスワードが正しくありません'
      });
    }
    
    // 新しいパスワードのハッシュ化
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // パスワードを更新
    await user.update({
      password: hashedPassword
    });
    
    return res.json({
      message: 'パスワードが変更されました'
    });
  } catch (err) {
    console.error('パスワード変更に失敗:', err);
    return res.status(500).json({
      message: 'パスワード変更中にエラーが発生しました'
    });
  }
};
