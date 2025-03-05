const dbConfig = require('../config/db.config');
const { Sequelize, DataTypes } = require('sequelize');

// Sequelizeインスタンスの作成
const sequelize = new Sequelize(
  dbConfig.DB,
  dbConfig.USER,
  dbConfig.PASSWORD,
  {
    host: dbConfig.HOST,
    port: dbConfig.PORT,
    dialect: dbConfig.dialect,
    operatorsAliases: 0,
    pool: dbConfig.pool,
    logging: dbConfig.logging,
    retry: {
      max: 10,
      match: [
        /ETIMEDOUT/,
        /ECONNREFUSED/,
        /PROTOCOL_CONNECTION_LOST/,
        /ECONNRESET/
      ],
      backoffBase: 1000,
      backoffExponent: 1.5,
    },
    define: {
      underscored: true,  // スネークケースのカラム名を使用
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  }
);

// データベース接続オブジェクト
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// モデルのインポート - すべて .model.js フォーマットを使用
db.User = require('./user.model')(sequelize, DataTypes);
db.Post = require('./post.model')(sequelize, DataTypes);
db.Category = require('./category.model')(sequelize, DataTypes);
db.Comment = require('./comment.model')(sequelize, DataTypes);
db.Like = require('./like.model')(sequelize, DataTypes);
db.PostCategory = require('./postCategory.model')(sequelize, DataTypes);

// リレーションシップの設定
// User - Post (1対多)
db.User.hasMany(db.Post, { as: 'posts', foreignKey: 'author_id' });
db.Post.belongsTo(db.User, { as: 'author', foreignKey: 'author_id' });

// User - Comment (1対多)
db.User.hasMany(db.Comment, { as: 'comments', foreignKey: 'author_id' });
db.Comment.belongsTo(db.User, { as: 'author', foreignKey: 'author_id' });

// Post - Comment (1対多)
db.Post.hasMany(db.Comment, { as: 'comments', foreignKey: 'post_id' });
db.Comment.belongsTo(db.Post, { as: 'post', foreignKey: 'post_id' });

// Post - Category (多対多)
db.Post.belongsToMany(db.Category, { 
  through: db.PostCategory,
  as: 'categories',
  foreignKey: 'post_id' 
});
db.Category.belongsToMany(db.Post, { 
  through: db.PostCategory,
  as: 'posts',
  foreignKey: 'category_id' 
});

// User - Post (いいね) (多対多)
db.User.belongsToMany(db.Post, { 
  through: db.Like,
  as: 'likedPosts',
  foreignKey: 'user_id' 
});
db.Post.belongsToMany(db.User, { 
  through: db.Like,
  as: 'likedBy',
  foreignKey: 'post_id' 
});

module.exports = db;