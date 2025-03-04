const dbConfig = require('../config/db.config');
const { Sequelize, DataTypes } = require('sequelize');

// Sequelizeインスタンスの作成
const sequelize = new Sequelize(
  dbConfig.DB,
  dbConfig.USER,
  dbConfig.PASSWORD,
  {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: 0,
    pool: {
      max: dbConfig.pool.max,
      min: dbConfig.pool.min,
      acquire: dbConfig.pool.acquire,
      idle: dbConfig.pool.idle
    },
    logging: console.log // 開発中はSQLログを表示
  }
);

// データベース接続オブジェクト
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// モデルのインポート
db.User = require('./user.model')(sequelize, DataTypes);
db.Post = require('./post.model')(sequelize, DataTypes);
db.Category = require('./category.model')(sequelize, DataTypes);
db.Comment = require('./comment.model')(sequelize, DataTypes);
db.Like = require('./like.model')(sequelize, DataTypes);
db.PostCategory = require('./postCategory.model')(sequelize, DataTypes);

// リレーションシップの設定
// User - Post (1対多)
db.User.hasMany(db.Post, { as: 'posts', foreignKey: 'authorId' });
db.Post.belongsTo(db.User, { as: 'author', foreignKey: 'authorId' });

// User - Comment (1対多)
db.User.hasMany(db.Comment, { as: 'comments', foreignKey: 'authorId' });
db.Comment.belongsTo(db.User, { as: 'author', foreignKey: 'authorId' });

// Post - Comment (1対多)
db.Post.hasMany(db.Comment, { as: 'comments', foreignKey: 'postId' });
db.Comment.belongsTo(db.Post, { as: 'post', foreignKey: 'postId' });

// Post - Category (多対多)
db.Post.belongsToMany(db.Category, { 
  through: db.PostCategory,
  as: 'categories',
  foreignKey: 'postId' 
});
db.Category.belongsToMany(db.Post, { 
  through: db.PostCategory,
  as: 'posts',
  foreignKey: 'categoryId' 
});

// User - Post (いいね) (多対多)
db.User.belongsToMany(db.Post, { 
  through: db.Like,
  as: 'likedPosts',
  foreignKey: 'userId' 
});
db.Post.belongsToMany(db.User, { 
  through: db.Like,
  as: 'likedBy',
  foreignKey: 'postId' 
});

module.exports = db;
