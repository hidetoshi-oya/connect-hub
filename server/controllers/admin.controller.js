const db = require('../models');
const User = db.User;
const Post = db.Post;
const Category = db.Category;
const Comment = db.Comment;
const { Op } = require('sequelize');

// ダッシュボード統計情報の取得
exports.getDashboardStats = async (req, res) => {
  try {
    // ユーザー数
    const userCount = await User.count();
    
    // 投稿数
    const postCount = await Post.count();
    
    // コメント数
    const commentCount = await Comment.count();
    
    // カテゴリ数
    const categoryCount = await Category.count();
    
    // 最近の投稿
    const recentPosts = await Post.findAll({
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name', 'department', 'avatar_url']
        }
      ],
      order: [['created_at', 'DESC']],
      limit: 5
    });
    
    // 最近の新規ユーザー
    const recentUsers = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['created_at', 'DESC']],
      limit: 5
    });
    
    return res.json({
      stats: {
        users: userCount,
        posts: postCount,
        comments: commentCount,
        categories: categoryCount
      },
      recent_posts: recentPosts,
      recent_users: recentUsers
    });
  } catch (err) {
    console.error('ダッシュボード統計情報の取得に失敗:', err);
    return res.status(500).json({
      message: 'ダッシュボード統計情報の取得中にエラーが発生しました'
    });
  }
};

// 全ユーザーリストを取得
exports.getAllUsers = async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    
    let where = {};
    
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { department: { [Op.like]: `%${search}%` } }
      ];
    }
    
    const users = await User.findAndCountAll({
      where,
      attributes: { exclude: ['password'] },
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    
    return res.json({
      total: users.count,
      page: parseInt(page),
      limit: parseInt(limit),
      total_pages: Math.ceil(users.count / limit),
      data: users.rows
    });
  } catch (err) {
    console.error('ユーザー一覧の取得に失敗:', err);
    return res.status(500).json({
      message: 'ユーザー一覧の取得中にエラーが発生しました'
    });
  }
};

// ユーザー情報を更新
exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, email, department, role, is_active } = req.body;
    
    // ユーザーを検索
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({
        message: 'ユーザーが見つかりません'
      });
    }
    
    // ユーザーを更新
    await user.update({
      name: name || user.name,
      email: email || user.email,
      department: department || user.department,
      role: role || user.role,
      is_active: is_active !== undefined ? is_active : user.is_active
    });
    
    // 更新後のユーザー情報を返す
    const updatedUser = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });
    
    return res.json({
      message: 'ユーザー情報が更新されました',
      user: updatedUser
    });
  } catch (err) {
    console.error('ユーザー情報の更新に失敗:', err);
    return res.status(500).json({
      message: 'ユーザー情報の更新中にエラーが発生しました'
    });
  }
};

// ユーザーを削除
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // ユーザーを検索
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({
        message: 'ユーザーが見つかりません'
      });
    }
    
    // ユーザーを論理削除
    await user.update({ is_active: false });
    
    return res.json({
      message: 'ユーザーが無効化されました'
    });
  } catch (err) {
    console.error('ユーザーの削除に失敗:', err);
    return res.status(500).json({
      message: 'ユーザーの削除中にエラーが発生しました'
    });
  }
};

// カテゴリを作成
exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    // 既存のカテゴリをチェック
    const existingCategory = await Category.findOne({
      where: { name }
    });
    
    if (existingCategory) {
      return res.status(400).json({
        message: '同じ名前のカテゴリが既に存在します'
      });
    }
    
    // カテゴリを作成
    const category = await Category.create({
      name,
      description,
      is_active: true
    });
    
    return res.status(201).json({
      message: 'カテゴリが作成されました',
      category
    });
  } catch (err) {
    console.error('カテゴリの作成に失敗:', err);
    return res.status(500).json({
      message: 'カテゴリの作成中にエラーが発生しました'
    });
  }
};

// カテゴリを更新
exports.updateCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { name, description, is_active } = req.body;
    
    // カテゴリを検索
    const category = await Category.findByPk(categoryId);
    
    if (!category) {
      return res.status(404).json({
        message: 'カテゴリが見つかりません'
      });
    }
    
    // 名前の重複チェック
    if (name && name !== category.name) {
      const existingCategory = await Category.findOne({
        where: { name }
      });
      
      if (existingCategory) {
        return res.status(400).json({
          message: '同じ名前のカテゴリが既に存在します'
        });
      }
    }
    
    // カテゴリを更新
    await category.update({
      name: name || category.name,
      description: description !== undefined ? description : category.description,
      is_active: is_active !== undefined ? is_active : category.is_active
    });
    
    return res.json({
      message: 'カテゴリが更新されました',
      category
    });
  } catch (err) {
    console.error('カテゴリの更新に失敗:', err);
    return res.status(500).json({
      message: 'カテゴリの更新中にエラーが発生しました'
    });
  }
};

// カテゴリを削除
exports.deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    
    // カテゴリを検索
    const category = await Category.findByPk(categoryId);
    
    if (!category) {
      return res.status(404).json({
        message: 'カテゴリが見つかりません'
      });
    }
    
    // カテゴリを無効化（論理削除）
    await category.update({ is_active: false });
    
    return res.json({
      message: 'カテゴリが無効化されました'
    });
  } catch (err) {
    console.error('カテゴリの削除に失敗:', err);
    return res.status(500).json({
      message: 'カテゴリの削除中にエラーが発生しました'
    });
  }
};

// 全投稿リストを取得
exports.getAllPosts = async (req, res) => {
  try {
    const { search, category, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    
    let where = {};
    
    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { content: { [Op.like]: `%${search}%` } }
      ];
    }
    
    // カテゴリ条件
    let includeOptions = [
      {
        model: User,
        as: 'author',
        attributes: ['id', 'name', 'department', 'avatar_url']
      },
      {
        model: Category,
        as: 'categories',
        attributes: ['id', 'name'],
        through: { attributes: [] }
      }
    ];
    
    if (category) {
      includeOptions = [
        ...includeOptions,
        {
          model: Category,
          as: 'categories',
          attributes: [],
          where: { name: category },
          through: { attributes: [] }
        }
      ];
    }
    
    const posts = await Post.findAndCountAll({
      where,
      include: includeOptions,
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
      distinct: true
    });
    
    return res.json({
      total: posts.count,
      page: parseInt(page),
      limit: parseInt(limit),
      total_pages: Math.ceil(posts.count / limit),
      data: posts.rows
    });
  } catch (err) {
    console.error('投稿一覧の取得に失敗:', err);
    return res.status(500).json({
      message: '投稿一覧の取得中にエラーが発生しました'
    });
  }
};

// 投稿を更新
exports.updatePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { title, content, isPinned, categories } = req.body;
    
    // 投稿を検索
    const post = await Post.findByPk(postId);
    
    if (!post) {
      return res.status(404).json({
        message: '投稿が見つかりません'
      });
    }
    
    // 投稿を更新
    await post.update({
      title: title || post.title,
      content: content || post.content,
      isPinned: isPinned !== undefined ? isPinned : post.isPinned
    });
    
    // カテゴリを更新
    if (categories && categories.length > 0) {
      // カテゴリ名からIDを取得
      const categoryRecords = await Category.findAll({
        where: {
          name: categories,
          is_active: true
        }
      });
      
      // 投稿とカテゴリを関連付け
      await post.setCategories(categoryRecords);
    }
    
    // 更新後の投稿を取得
    const updatedPost = await Post.findByPk(postId, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name', 'department', 'avatar_url']
        },
        {
          model: Category,
          as: 'categories',
          attributes: ['id', 'name'],
          through: { attributes: [] }
        }
      ]
    });
    
    return res.json({
      message: '投稿が更新されました',
      post: updatedPost
    });
  } catch (err) {
    console.error('投稿の更新に失敗:', err);
    return res.status(500).json({
      message: '投稿の更新中にエラーが発生しました'
    });
  }
};

// 投稿を削除
exports.deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    
    // 投稿を検索
    const post = await Post.findByPk(postId);
    
    if (!post) {
      return res.status(404).json({
        message: '投稿が見つかりません'
      });
    }
    
    // 投稿を削除（論理削除）
    await post.destroy();
    
    return res.json({
      message: '投稿が削除されました'
    });
  } catch (err) {
    console.error('投稿の削除に失敗:', err);
    return res.status(500).json({
      message: '投稿の削除中にエラーが発生しました'
    });
  }
};
