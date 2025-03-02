// MySQL用のSequelize設定ファイル
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'connecthub',
  process.env.DB_USER || 'connecthub_user',
  process.env.DB_PASSWORD || 'connecthub_password',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    logging: process.env.NODE_ENV === 'development' ? console.log : false
  }
);

// データベース接続テスト
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('データベース接続に成功しました');
  } catch (error) {
    console.error('データベース接続に失敗しました:', error);
  }
};

testConnection();

module.exports = sequelize;