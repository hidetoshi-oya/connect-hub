#!/bin/bash

# 色の定義
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}ConnectHub社内報システム起動スクリプト${NC}"
echo "----------------------------------------"

# Docker Composeコマンドの決定（Docker Compose v1とv2の両方に対応）
if command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE="docker-compose"
elif command -v docker &> /dev/null && docker compose version &> /dev/null; then
    DOCKER_COMPOSE="docker compose"
else
    echo -e "${RED}エラー: Docker Composeがインストールされていません。${NC}"
    echo "Docker Desktopをインストールするか、Docker Composeを別途インストールしてください。"
    exit 1
fi

echo -e "${YELLOW}Docker Composeコマンド: ${DOCKER_COMPOSE}${NC}"

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

if [ ! -f "mysql/init/01-schema.sql" ] || [ ! -f "mysql/init/02-test-data.sql" ]; then
    echo -e "${RED}エラー: MySQLの初期化スクリプトが見つかりません。${NC}"
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

# Dockerコンテナを起動
echo -e "${YELLOW}Dockerコンテナを起動しています...${NC}"
$DOCKER_COMPOSE up -d

# コンテナの起動を待つ
echo -e "${YELLOW}MySQLサービスの起動を待っています...${NC}"
sleep 10

# MySQLコンテナが正常に起動したか確認
if ! $DOCKER_COMPOSE ps | grep -q "connect-hub-mysql.*Up"; then
    echo -e "${RED}エラー: MySQLコンテナの起動に失敗しました。${NC}"
    echo "ログを確認してください: $DOCKER_COMPOSE logs mysql"
    exit 1
fi

echo -e "${YELLOW}バックエンドサービスの起動を待っています...${NC}"
sleep 5

# バックエンドコンテナが正常に起動したか確認
if ! $DOCKER_COMPOSE ps | grep -q "connect-hub-backend.*Up"; then
    echo -e "${RED}警告: バックエンドコンテナが正常に起動していない可能性があります。${NC}"
    echo "ログを確認してください: $DOCKER_COMPOSE logs backend"
else
    echo -e "${GREEN}バックエンドサービスが正常に起動しました。${NC}"
fi

# フロントエンドコンテナが正常に起動したか確認
if ! $DOCKER_COMPOSE ps | grep -q "connect-hub-frontend.*Up"; then
    echo -e "${RED}警告: フロントエンドコンテナが正常に起動していない可能性があります。${NC}"
    echo "ログを確認してください: $DOCKER_COMPOSE logs frontend"
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
echo "$DOCKER_COMPOSE down"

exit 0