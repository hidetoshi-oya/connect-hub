FROM node:20

WORKDIR /app

# package.jsonとpackage-lock.jsonをコピー
COPY package*.json ./

# npmのログレベルを詳細に設定
ENV NPM_CONFIG_LOGLEVEL verbose

# キャッシュをクリアして確実に最新の依存関係をインストール
RUN npm cache clean --force

# 依存関係を明示的にインストール
RUN npm install express cors dotenv bcrypt jsonwebtoken mysql2 sequelize swagger-jsdoc swagger-ui-express
RUN npm install -g nodemon

# package.jsonの依存関係も念のためインストール
RUN npm install

# コードをコピー
COPY . .

# ポート番号を8000に設定
EXPOSE 8000

# サーバーを起動
CMD ["node", "server.js"]
