FROM node:16-alpine

# 必要なツールをインストール
RUN apk add --no-cache bash

WORKDIR /app

# package.jsonとpackage-lock.jsonをコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm install

# react-scriptsをグローバルにインストール
RUN npm install -g react-scripts@5.0.1

# プロジェクトファイルをコピー
COPY . .

# ミスがないようにstartscriptを直接指定
RUN sed -i 's/"start": "react-scripts start"/"start": ".\/node_modules\/.bin\/react-scripts start"/' package.json

EXPOSE 3000

# アプリケーションを起動
CMD ["npm", "start"]
