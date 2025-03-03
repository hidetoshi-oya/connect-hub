FROM node:16

WORKDIR /app

# package.jsonをコピー
COPY package.json ./

# 依存関係をインストール
RUN npm install

# nodemonをグローバルにインストール
RUN npm install -g nodemon

# Swagger関連の依存関係を明示的にインストール
RUN npm install swagger-jsdoc swagger-ui-express

# ソースコードをコピー
COPY . .

# ポート番号を8000に設定
EXPOSE 8000

# 起動コマンド
CMD ["nodemon", "server.js"]
