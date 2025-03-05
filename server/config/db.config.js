// MySQL用のSequelize設定
module.exports = {
  HOST: process.env.DB_HOST || 'localhost',
  USER: process.env.DB_USER || 'connecthub_user',
  PASSWORD: process.env.DB_PASSWORD || 'connecthub_password',
  DB: process.env.DB_NAME || 'connecthub',
  PORT: process.env.DB_PORT || 3306,
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  logging: process.env.NODE_ENV === 'development' ? console.log : false
};