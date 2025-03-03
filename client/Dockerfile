FROM node:16-alpine

WORKDIR /app

# パッケージファイルをコピー
COPY package.json ./
COPY package-lock.json* ./

# 必要な全ての依存関係を明示的にインストール
RUN npm install react \
    react-dom \
    react-router-dom \
    react-scripts \
    web-vitals \
    axios \
    date-fns \
    @testing-library/jest-dom \
    @testing-library/react \
    @testing-library/user-event

# アプリケーションのソースコードをコピー
COPY . .

# 環境変数のPATHを設定
ENV PATH /app/node_modules/.bin:$PATH

# ポート番号を3000に設定
EXPOSE 3000

# アプリケーションを起動
CMD ["npx", "react-scripts", "start"]
