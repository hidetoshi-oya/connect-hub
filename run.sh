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

# 既存のコンテナとイメージをクリーンアップ
echo -e "${YELLOW}既存のコンテナとイメージを確認しています...${NC}"

# コンテナの停止と削除
if [ "$(docker ps -a -q -f name=connect-hub-mysql)" ]; then
    echo "既存のMySQLコンテナを停止・削除します..."
    docker stop connect-hub-mysql && docker rm connect-hub-mysql
fi

if [ "$(docker ps -a -q -f name=connect-hub-backend)" ]; then
    echo "既存のバックエンドコンテナを停止・削除します..."
    docker stop connect-hub-backend && docker rm connect-hub-backend
fi

if [ "$(docker ps -a -q -f name=connect-hub-frontend)" ]; then
    echo "既存のフロントエンドコンテナを停止・削除します..."
    docker stop connect-hub-frontend && docker rm connect-hub-frontend
fi

# イメージの削除（強制再ビルドのため）
if [ "$(docker images -q connect-hub-backend)" ]; then
    echo "既存のバックエンドイメージを削除します..."
    docker rmi connect-hub-backend
fi

if [ "$(docker images -q connect-hub-frontend)" ]; then
    echo "既存のフロントエンドイメージを削除します..."
    docker rmi connect-hub-frontend
fi

# Docker APIを使って直接コンテナを起動
echo -e "${YELLOW}Dockerコンテナを起動しています...${NC}"

# ネットワークの作成（存在しない場合）
if ! docker network inspect connect-hub-network &> /dev/null; then
    docker network create connect-hub-network
fi

# MySQLコンテナの起動
echo "MySQLコンテナを起動しています..."
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

# コンテナの起動を待つ
echo -e "${YELLOW}MySQLサービスの起動を待っています...${NC}"
# より長い待機時間を設定
for i in {1..30}; do
    if docker ps | grep -q "connect-hub-mysql"; then
        echo "MySQLコンテナが起動しました。初期化を待っています..."
        break
    fi
    if [ $i -eq 30 ]; then
        echo -e "${RED}エラー: MySQLコンテナの起動に失敗しました。${NC}"
        echo "ログを確認してください: docker logs connect-hub-mysql"
        exit 1
    fi
    sleep 1
done

# MySQLの初期化を待つ（追加の待機時間）
echo "MySQLデータベースの初期化を待っています..."
sleep 20

# バックエンドの起動
echo -e "${YELLOW}バックエンドのビルドと起動...${NC}"
docker build -t connect-hub-backend ./server --no-cache
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

echo -e "${YELLOW}バックエンドサービスの起動を待っています...${NC}"
sleep 5

# フロントエンドの起動
echo -e "${YELLOW}フロントエンドのビルドと起動...${NC}"
docker build -t connect-hub-frontend ./client --no-cache
docker run -d \
    --name connect-hub-frontend \
    --network connect-hub-network \
    -e NODE_ENV=development \
    -e REACT_APP_API_URL=http://localhost:5000/api \
    -p 3000:3000 \
    -v "$(pwd)/client:/app" \
    --restart always \
    connect-hub-frontend

# コンテナが実行中かチェック
MYSQL_RUNNING=$(docker ps | grep connect-hub-mysql | wc -l)
BACKEND_RUNNING=$(docker ps | grep connect-hub-backend | wc -l)
FRONTEND_RUNNING=$(docker ps | grep connect-hub-frontend | wc -l)

if [ "$MYSQL_RUNNING" -eq 0 ]; then
    echo -e "${RED}警告: MySQLコンテナが実行されていません。${NC}"
    echo "ログを確認してください: docker logs connect-hub-mysql"
else
    echo -e "${GREEN}MySQLサービスが正常に起動しました。${NC}"
fi

if [ "$BACKEND_RUNNING" -eq 0 ]; then
    echo -e "${RED}警告: バックエンドコンテナが実行されていません。${NC}"
    echo "ログを確認してください: docker logs connect-hub-backend"
else
    echo -e "${GREEN}バックエンドサービスが正常に起動しました。${NC}"
fi

if [ "$FRONTEND_RUNNING" -eq 0 ]; then
    echo -e "${RED}警告: フロントエンドコンテナが実行されていません。${NC}"
    echo "ログを確認してください: docker logs connect-hub-frontend"
else
    echo -e "${GREEN}フロントエンドサービスが正常に起動しました。${NC}"
fi

echo -e "${YELLOW}各サービスのログを確認するには:${NC}"
echo "docker logs connect-hub-mysql     # MySQLのログ"
echo "docker logs connect-hub-backend   # バックエンドのログ"
echo "docker logs connect-hub-frontend  # フロントエンドのログ"

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
echo "./stop.sh"
echo "または"
echo "docker stop connect-hub-mysql connect-hub-backend connect-hub-frontend"
echo "docker rm connect-hub-mysql connect-hub-backend connect-hub-frontend"

exit 0