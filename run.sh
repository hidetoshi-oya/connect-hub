#!/bin/bash

# 色の定義
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}ConnectHub社内報システム起動スクリプト${NC}"
echo "----------------------------------------"

# 必要なディレクトリが存在することを確認
echo -e "${YELLOW}必要なディレクトリを確認しています...${NC}"
mkdir -p mysql/init
mkdir -p server
mkdir -p client

# 必要なファイルが存在するか確認
if [ ! -f "docker-compose.yml" ]; then
    echo -e "${RED}エラー: docker-compose.ymlファイルが見つかりません。${NC}"
    exit 1
fi

# サーバーディレクトリのチェック
if [ ! -d "server/models" ] || [ ! -d "server/config" ]; then
    echo -e "${YELLOW}警告: サーバーのモデルディレクトリが見つかりません。${NC}"
    echo "続行すると、Dockerビルド時にエラーが発生する可能性があります。"
    read -p "続行しますか？ (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Docker APIを使って直接コンテナを起動
echo -e "${YELLOW}Dockerコンテナを起動しています...${NC}"

# ネットワークの作成（存在しない場合）
if ! docker network inspect connect-hub-network &> /dev/null; then
    docker network create connect-hub-network
fi

# MySQLコンテナの起動
docker run -d \
    --name connect-hub-mysql \
    --network connect-hub-network \
    -e MYSQL_ROOT_PASSWORD=rootpassword \
    -e MYSQL_DATABASE=connecthub \
    -e MYSQL_USER=connecthub_user \
    -e MYSQL_PASSWORD=connecthub_password \
    -p 3306:3306 \
    -v "$(pwd)/mysql/init:/docker-entrypoint-initdb.d" \
    --restart always \
    mysql:8.0 --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci

# バックエンドの起動
echo -e "${YELLOW}バックエンドのビルドと起動...${NC}"
docker build -t connect-hub-backend ./server
docker run -d \
    --name connect-hub-backend \
    --network connect-hub-network \
    -e NODE_ENV=development \
    -e PORT=5000 \
    -e DB_HOST=connect-hub-mysql \
    -e DB_PORT=3306 \
    -e DB_USER=connecthub_user \
    -e DB_PASSWORD=connecthub_password \
    -e DB_NAME=connecthub \
    -e JWT_SECRET=your_jwt_secret_key \
    -p 5000:5000 \
    -v "$(pwd)/server:/app" \
    --restart always \
    connect-hub-backend

# フロントエンドの起動
echo -e "${YELLOW}フロントエンドのビルドと起動...${NC}"
docker build -t connect-hub-frontend ./client
docker run -d \
    --name connect-hub-frontend \
    --network connect-hub-network \
    -e NODE_ENV=development \
    -e REACT_APP_API_URL=http://localhost:5000/api \
    -p 3000:3000 \
    -v "$(pwd)/client:/app" \
    --restart always \
    connect-hub-frontend

# コンテナの起動を待つ
echo -e "${YELLOW}MySQLサービスの起動を待っています...${NC}"
sleep 10

# MySQLコンテナが正常に起動したか確認
if ! docker ps | grep -q "connect-hub-mysql.*Up"; then
    echo -e "${RED}エラー: MySQLコンテナの起動に失敗しました。${NC}"
    echo "ログを確認してください: docker logs connect-hub-mysql"
    exit 1
fi

echo -e "${YELLOW}バックエンドサービスの起動を待っています...${NC}"
sleep 5

# バックエンドコンテナが正常に起動したか確認
if ! docker ps | grep -q "connect-hub-backend"; then
    echo -e "${RED}警告: バックエンドコンテナが正常に起動していない可能性があります。${NC}"
    echo "ログを確認してください: docker logs connect-hub-backend"
else
    echo -e "${GREEN}バックエンドサービスが正常に起動しました。${NC}"
fi

# フロントエンドコンテナが正常に起動したか確認
if ! docker ps | grep -q "connect-hub-frontend"; then
    echo -e "${RED}警告: フロントエンドコンテナが正常に起動していない可能性があります。${NC}"
    echo "ログを確認してください: docker logs connect-hub-frontend"
else
    echo -e "${GREEN}フロントエンドサービスが正常に起動しました。${NC}"
fi

echo -e "${GREEN}システムの起動が完了しました！${NC}"
echo "----------------------------------------"
echo -e "フロントエンド: ${GREEN}http://localhost:3000${NC}"
echo -e "バックエンドAPI: ${GREEN}http://localhost:5000/api${NC}"
echo "----------------------------------------"
echo -e "${YELLOW}初期管理者アカウント:${NC}"
echo "Email: admin@example.com"
echo "Password: password"
echo "----------------------------------------"
echo -e "${YELLOW}システムを停止するには以下のコマンドを実行:${NC}"
echo "docker stop connect-hub-mysql connect-hub-backend connect-hub-frontend"
echo "docker rm connect-hub-mysql connect-hub-backend connect-hub-frontend"

exit 0