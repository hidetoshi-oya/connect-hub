FROM node:16-alpine

WORKDIR /app

# package.jsonとpackage-lock.jsonをコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm install

# プロジェクトファイルをコピー
COPY . .

# より直接的な方法で実行
# npm startではなく、直接nodeコマンドでreact-scriptsを実行
EXPOSE 3000

CMD ["node", "node_modules/react-scripts/scripts/start.js"]
