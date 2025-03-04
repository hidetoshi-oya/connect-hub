const db = require('../models');
const User = db.User;
const Post = db.Post;
const Category = db.Category;
const { Op } = require('sequelize');

// 全ユーザーリストを取得（管理者用）
exports.findAll = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['created_at', 'DESC']]
    });
    
    return res.json(users);
  } catch (err) {
    console.error('ユーザー一覧の取得に失敗:', err);
    return res.status(500).json({
      message: 'ユーザー一覧の取得中にエラーが発生しました'
    });
  }
};

// 特定のユーザー情報を取得
exports.findOne = async (req, res) => {
  try {
    const userId = req.params.id;
    
    const user = await User.findByPk(userId, {
      attributes: ['id', 'name', 'email', 'department', 'role', 'bio', 'avatar_url', 'created_at'],
    });
    
    if (!user) {
      return res.status(404).json({
        message: 'ユーザーが見つかりません'
      });
    }
    
    return res.json(user);
  } catch (err) {
    console.error('ユーザー情報の取得に失敗:', err);
    return res.status(500).json({
      message: 'ユーザー情報の取得中にエラーが発生しました'
    });
  }
};

// 自分のプロフィール情報を取得
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
    console.error('プロフィール情報の取得に失敗:', err);
    return res.status(500).json({
      message: 'プロフィール情報の取得中にエラーが発生しました'
    });
  }
};

// プロフィール情報を更新
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, department, bio } = req.body;
    
    // ユーザーを検索
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({
        message: 'ユーザーが見つかりません'
      });
    }
    
    // フィールドを更新
    await user.update({
      name: name || user.name,
      department: department || user.department,
      bio: bio !== undefined ? bio : user.bio
    });
    
    // 更新されたユーザー情報を返す
    return res.json({
      message: 'プロフィールが更新されました',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        department: user.department,
        role: user.role,
        bio: user.bio,
        avatar_url: user.avatar_url,
        created_at: user.created_at,
        updated_at: user.updated_at
      }
    });
  } catch (err) {
    console.error('プロフィールの更新に失敗:', err);
    return res.status(500).json({
      message: 'プロフィールの更新中にエラーが発生しました'
    });
  }
};

// アバター画像をアップロード
exports.uploadAvatar = async (req, res) => {
  try {
    const userId = req.userId;
    
    // ここで画像アップロード処理を実装
    // 実際のアプリケーションではファイルアップロードミドルウェアを使用
    
    // テスト用のダミー応答
    return res.json({
      message: 'アバターが更新されました',
      avatar_url: '/avatars/default.jpg'
    });
  } catch (err) {
    console.error('アバターの更新に失敗:', err);
    return res.status(500).json({
      message: 'アバターの更新中にエラーが発生しました'
    });
  }
};

// ユーザーの投稿一覧を取得
exports.getUserPosts = async (req, res) => {
  try {
    const userId = req.params.id;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    
    // ユーザーが存在するか確認
    const user = await User.findByPk(userId, {
      attributes: ['id', 'name', 'department', 'avatar_url']
    });
    
    if (!user) {
      return res.status(404).json({
        message: 'ユーザーが見つかりません'
      });
    }
    
    // ユーザーの投稿を取得
    const posts = await Post.findAndCountAll({
      where: { authorId: userId },
      include: [
        {
          model: Category,
          as: 'categories',
          attributes: ['id', 'name'],
          through: { attributes: [] }
        }
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    
    // レスポンス用にデータを整形
    const formattedPosts = posts.rows.map(post => ({
      id: post.id,
      title: post.title,
      content: post.content,
      isPinned: post.isPinned,
      created_at: post.created_at,
      updated_at: post.updated_at,
      categories: post.categories
    }));
    
    return res.json({
      user: user,
      total: posts.count,
      page: parseInt(page),
      limit: parseInt(limit),
      total_pages: Math.ceil(posts.count / limit),
      posts: formattedPosts
    });
  } catch (err) {
    console.error('ユーザーの投稿一覧の取得に失敗:', err);
    return res.status(500).json({
      message: 'ユーザーの投稿一覧の取得中にエラーが発生しました'
    });
  }
};
