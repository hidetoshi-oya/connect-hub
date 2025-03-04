FROM node:20

WORKDIR /app

# package.jsonとpackage-lock.jsonをコピー
COPY package*.json ./

# インストール処理を1つのステップにまとめる
RUN npm install && npm install -g nodemon

# コードをコピー
COPY . .

# ポート番号を8000に設定
EXPOSE 8000

# サーバーを起動
CMD ["node", "server.js"]
