FROM node:16-alpine

WORKDIR /app

# package.jsonとpackage-lock.jsonをコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm install

# プロジェクトファイルをコピー
COPY . .

# react-scriptsがインストールされていることを確認
RUN npm install react-scripts@5.0.1 --save

# グローバルパスにシンボリックリンクを作成
RUN ln -s /app/node_modules/.bin/react-scripts /usr/local/bin/react-scripts

EXPOSE 3000

# アプリケーションを起動
CMD ["npm", "start"]
