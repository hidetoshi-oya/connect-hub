FROM node:16

WORKDIR /app

# package.jsonとpackage-lock.jsonをコピー
COPY package.json ./

# 依存関係をインストール
RUN npm install

# プロジェクトファイルをコピー
COPY . .

EXPOSE 3000

# シンプルな起動方法
CMD ["sh", "-c", "node node_modules/react-scripts/scripts/start.js"]