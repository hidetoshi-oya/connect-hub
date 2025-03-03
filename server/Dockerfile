FROM node:16-alpine

WORKDIR /app

COPY package*.json ./

# 開発依存関係を含めてすべての依存関係をインストール
RUN npm install --include=dev

COPY . .

# ポート番号を8000に変更
EXPOSE 8000

CMD ["npm", "run", "dev"]