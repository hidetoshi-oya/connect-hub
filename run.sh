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

# 既存のコンテナを停止
echo -e "${YELLOW}既存のコンテナを停止しています...${NC}"
docker-compose down

# イメージを再ビルド（キャッシュを使わない）
echo -e "${YELLOW}Dockerイメージを再ビルドしています...${NC}"
docker-compose build --no-cache

# コンテナを起動
echo -e "${YELLOW}コンテナを起動しています...${NC}"
docker-compose up -d

# コンテナのステータスを確認
echo -e "${YELLOW}コンテナのステータスを確認しています...${NC}"
sleep 5
docker-compose ps

echo -e "${YELLOW}各サービスのログを確認するには:${NC}"
echo "docker-compose logs mysql     # MySQLのログ"
echo "docker-compose logs backend   # バックエンドのログ"
echo "docker-compose logs frontend  # フロントエンドのログ"

echo -e "${GREEN}システムの起動が完了しました！${NC}"
echo "----------------------------------------"
echo -e "フロントエンド: ${GREEN}http://localhost:3000${NC}"
echo -e "バックエンドAPI: ${GREEN}http://localhost:8000/api${NC}"
echo "----------------------------------------"
echo -e "${YELLOW}初期管理者アカウント:${NC}"
echo "Email: admin@example.com"
echo "Password: password"
echo "----------------------------------------"
echo -e "${YELLOW}システムを停止するには以下のコマンドを実行:${NC}"
echo "./stop.sh"
echo "または"
echo "docker-compose down"

exit 0
