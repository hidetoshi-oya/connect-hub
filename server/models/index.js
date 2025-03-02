// models/index.js - モデル関連付け
const sequelize = require('../config/db.config');
const User = require('./User');
const Post = require('./Post');
const Comment = require('./Comment');
const Category = require('./Category');
const Like = require('./Like');
const PostCategory = require('./PostCategory');

// ユーザーと投稿の関連付け
User.hasMany(Post, { foreignKey: 'author_id', as: 'posts' });
Post.belongsTo(User, { foreignKey: 'author_id', as: 'author' });

// ユーザーとコメントの関連付け
User.hasMany(Comment, { foreignKey: 'author_id', as: 'comments' });
Comment.belongsTo(User, { foreignKey: 'author_id', as: 'author' });

// 投稿とコメントの関連付け
Post.hasMany(Comment, { foreignKey: 'post_id', as: 'comments' });
Comment.belongsTo(Post, { foreignKey: 'post_id', as: 'post' });

// 投稿といいねの関連付け
Post.hasMany(Like, { foreignKey: 'post_id', as: 'likes' });
Like.belongsTo(Post, { foreignKey: 'post_id', as: 'post' });

// ユーザーといいねの関連付け
User.hasMany(Like, { foreignKey: 'user_id', as: 'likes' });
Like.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// 投稿とカテゴリの関連付け（多対多）
Post.belongsToMany(Category, { 
  through: PostCategory,
  foreignKey: 'post_id',
  otherKey: 'category_name',
  as: 'categories' 
});

Category.belongsToMany(Post, { 
  through: PostCategory,
  foreignKey: 'category_name',
  otherKey: 'post_id',
  as: 'posts' 
});

// 全てのモデルをエクスポート
module.exports = {
  sequelize,
  User,
  Post,
  Comment,
  Category,
  Like,
  PostCategory
};