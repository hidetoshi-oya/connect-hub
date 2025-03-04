const db = require('../models');
const Category = db.Category;
const Post = db.Post;
const User = db.User;
const { Op } = require('sequelize');

// カテゴリ一覧を取得
exports.findAll = async (req, res) => {
  try {
    const { active_only } = req.query;
    let where = {};
    
    if (active_only === 'true') {
      where.is_active = true;
    }
    
    const categories = await Category.findAll({
      where,
      order: [['name', 'ASC']]
    });
    
    return res.json(categories);
  } catch (err) {
    console.error('カテゴリの取得に失敗:', err);
    return res.status(500).json({
      message: 'カテゴリの取得中にエラーが発生しました'
    });
  }
};

// 特定のカテゴリを取得
exports.findOne = async (req, res) => {
  try {
    const categoryId = req.params.id;
    
    const category = await Category.findByPk(categoryId);
    
    if (!category) {
      return res.status(404).json({
        message: 'カテゴリが見つかりません'
      });
    }
    
    return res.json(category);
  } catch (err) {
    console.error('カテゴリの取得に失敗:', err);
    return res.status(500).json({
      message: 'カテゴリの取得中にエラーが発生しました'
    });
  }
};

// 新規カテゴリの作成 (管理者専用)
exports.create = async (req, res) => {
  try {
    const { name, description, is_active } = req.body;
    
    // 既存のカテゴリをチェック
    const existingCategory = await Category.findOne({
      where: { name }
    });
    
    if (existingCategory) {
      return res.status(400).json({
        message: 'このカテゴリ名は既に使用されています'
      });
    }
    
    // カテゴリを作成
    const category = await Category.create({
      name,
      description,
      is_active: is_active !== undefined ? is_active : true
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

// カテゴリの更新 (管理者専用)
exports.update = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { name, description, is_active } = req.body;
    
    // カテゴリを取得
    const category = await Category.findByPk(categoryId);
    
    if (!category) {
      return res.status(404).json({
        message: 'カテゴリが見つかりません'
      });
    }
    
    // 名前の重複をチェック
    if (name && name !== category.name) {
      const existingCategory = await Category.findOne({
        where: { name }
      });
      
      if (existingCategory) {
        return res.status(400).json({
          message: 'このカテゴリ名は既に使用されています'
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

// カテゴリの削除 (管理者専用)
exports.delete = async (req, res) => {
  try {
    const categoryId = req.params.id;
    
    // カテゴリを取得
    const category = await Category.findByPk(categoryId);
    
    if (!category) {
      return res.status(404).json({
        message: 'カテゴリが見つかりません'
      });
    }
    
    // カテゴリを削除（関連するポストからも関連付けが削除される）
    await category.destroy();
    
    return res.json({
      message: 'カテゴリが削除されました'
    });
  } catch (err) {
    console.error('カテゴリの削除に失敗:', err);
    return res.status(500).json({
      message: 'カテゴリの削除中にエラーが発生しました'
    });
  }
};

// カテゴリに属する投稿一覧を取得
exports.getPosts = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    
    // カテゴリを確認
    const category = await Category.findByPk(categoryId);
    
    if (!category) {
      return res.status(404).json({
        message: 'カテゴリが見つかりません'
      });
    }
    
    // カテゴリに属する投稿を取得
    const posts = await Post.findAndCountAll({
      include: [
        {
          model: Category,
          as: 'categories',
          where: { id: categoryId },
          attributes: ['id', 'name', 'description'],
          through: { attributes: [] }
        },
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name', 'email', 'department', 'role', 'avatar_url']
        },
        {
          model: User,
          as: 'likedBy',
          attributes: ['id'],
          through: { attributes: [] }
        }
      ],
      order: [
        ['isPinned', 'DESC'],
        ['created_at', 'DESC']
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      distinct: true
    });
    
    // レスポンス用にデータを整形
    const formattedPosts = posts.rows.map(post => {
      const likes = post.likedBy ? post.likedBy.map(user => ({ user_id: user.id })) : [];
      
      return {
        id: post.id,
        title: post.title,
        content: post.content,
        isPinned: post.isPinned,
        created_at: post.created_at,
        updated_at: post.updated_at,
        author: post.author,
        categories: post.categories,
        likes: likes
      };
    });
    
    return res.json({
      total: posts.count,
      page: parseInt(page),
      limit: parseInt(limit),
      total_pages: Math.ceil(posts.count / limit),
      category: {
        id: category.id,
        name: category.name,
        description: category.description
      },
      data: formattedPosts
    });
  } catch (err) {
    console.error('カテゴリの投稿取得に失敗:', err);
    return res.status(500).json({
      message: 'カテゴリの投稿取得中にエラーが発生しました'
    });
  }
};
