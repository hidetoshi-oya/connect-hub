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

# PATHに追加して環境変数を設定
ENV PATH /app/node_modules/.bin:$PATH

# グローバルパスに複数のシンボリックリンクを作成
RUN ln -s /app/node_modules/.bin/react-scripts /usr/local/bin/react-scripts \
    && ln -s /app/node_modules/.bin/react-scripts /usr/bin/react-scripts

EXPOSE 3000

# アプリケーションを起動
CMD ["npm", "start"]
