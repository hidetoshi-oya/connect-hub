FROM node:20

WORKDIR /app

# package.jsonとpackage-lock.jsonをコピー
COPY package.json ./

# node_modulesが存在する場合は削除
RUN rm -rf node_modules

# 依存関係をインストール
# 必要なパッケージを明示的にインストール
RUN npm install react react-dom
RUN npm install react-router-dom
RUN npm install react-scripts
RUN npm install web-vitals
RUN npm install axios
RUN npm install date-fns

# プロジェクトファイルをコピー
COPY . .

EXPOSE 3000

# より確実なReactアプリの起動方法
CMD ["npx", "--no-install", "react-scripts", "start"]
