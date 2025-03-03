FROM node:20

WORKDIR /app

# package.jsonとpackage-lock.jsonをコピー（もし存在する場合）
COPY package*.json ./

# node_modulesが存在する場合は削除
RUN rm -rf node_modules

# 新規にインストールする
# インストール時にみやすいように各ステップを分ける
RUN npm install express
RUN npm install cors
RUN npm install dotenv
RUN npm install bcrypt
RUN npm install jsonwebtoken
RUN npm install mysql2
RUN npm install sequelize
RUN npm install swagger-jsdoc
RUN npm install swagger-ui-express
RUN npm install -g nodemon

# 全てのソースコードをコピー
COPY . .

# ポート番号を8000に設定
EXPOSE 8000

# 直接nodeで実行する
# 開発中の場合はnodemonも選択可能
CMD ["node", "server.js"]
