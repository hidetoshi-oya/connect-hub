FROM node:16-alpine

WORKDIR /app

COPY package*.json ./

# 開発依存関係を含めてすべての依存関係をインストール
RUN npm install --include=dev

# nodemonのグローバルインストールと環境変数PATHへの追加
RUN npm install -g nodemon
ENV PATH /app/node_modules/.bin:$PATH

# nodemonのグローバルパスにシンボリックリンクを作成
RUN ln -s /usr/local/bin/nodemon /usr/bin/nodemon

COPY . .

# ポート番号を8000に変更
EXPOSE 8000

CMD ["npm", "run", "dev"]