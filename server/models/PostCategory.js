// PostCategory.js - MySQL用の投稿-カテゴリ関連モデル（Sequelizeを使用）
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const PostCategory = sequelize.define('PostCategory', {
  post_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    references: {
      model: 'posts',
      key: 'id'
    }
  },
  category_name: {
    type: DataTypes.STRING(100),
    primaryKey: true,
    allowNull: false,
    references: {
      model: 'categories',
      key: 'name'
    }
  }
}, {
  tableName: 'post_categories',
  timestamps: false // 中間テーブルのタイムスタンプは不要
});

module.exports = PostCategory;