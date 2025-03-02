// Like.js - MySQL用のいいねモデル（Sequelizeを使用）
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Like = sequelize.define('Like', {
  post_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    references: {
      model: 'posts',
      key: 'id'
    }
  },
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'likes',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false // いいねの更新日時は不要
});

module.exports = Like;