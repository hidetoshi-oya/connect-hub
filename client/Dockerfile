FROM node:20

WORKDIR /app

# package.jsonとpackage-lock.jsonをコピー
COPY package.json ./
COPY package-lock.json* ./

# 依存関係をインストール
# パッケージを個別にインストールする代わりに、package.jsonの依存関係をすべてインストール
RUN npm install

# プロジェクトファイルをコピー
COPY . .

EXPOSE 3000

# 開発モードでReactアプリを起動
CMD ["npm", "start"]
