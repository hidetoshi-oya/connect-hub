#!/bin/bash

# 色の定義
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}ConnectHub社内報システム起動スクリプト${NC}"
echo "----------------------------------------"

# ディスクの空き容量を確認
echo -e "${YELLOW}ディスクの空き容量を確認しています...${NC}"
AVAILABLE_SPACE=$(df -k / | awk '{print $4}' | tail -n 1)
MIN_REQUIRED_SPACE=524288  # 512 MB in KB

if [ "$AVAILABLE_SPACE" -lt "$MIN_REQUIRED_SPACE" ]; then
    echo -e "${RED}エラー: ディスクの空き容量が不足しています。最低512MB必要です。${NC}"
    echo "不要なファイルを削除するか、ディスクの空き容量を増やしてください。"
    exit 1
fi

# 必要なディレクトリが存在することを確認
echo -e "${YELLOW}必要なディレクトリを確認しています...${NC}"
mkdir -p mysql/init
mkdir -p server
mkdir -p client
mkdir -p /tmp/mysql_tmp  # MySQLの一時ディレクトリを作成
chmod 777 /tmp/mysql_tmp  # アクセス権を設定

# 必要なファイルが存在するか確認
if [ ! -f "docker-compose.yml" ]; then
    echo -e "${RED}エラー: docker-compose.ymlファイルが見つかりません。${NC}"
    exit 1
fi

# 一度クリーンアップを実行してから起動
echo -e "${YELLOW}システムをクリーンアップしています...${NC}"
./cleanup.sh

# イメージを再ビルド（キャッシュを使わない）
echo -e "${YELLOW}Dockerイメージを再ビルドしています...${NC}"
docker-compose build --no-cache

# ボリュームが正しく作成されたか確認
echo -e "${YELLOW}Dockerボリュームを確認しています...${NC}"
docker volume create --name=mysql_data
docker volume create --name=backend_logs
docker volume create --name=frontend_logs

# コンテナを起動
echo -e "${YELLOW}コンテナを起動しています...${NC}"
docker-compose up -d

# コンテナのステータスを確認
echo -e "${YELLOW}コンテナのステータスを確認しています...${NC}"
sleep 5
docker-compose ps

# MySQLの起動を待機
echo -e "${YELLOW}MySQLの起動を待機しています...${NC}"
MAX_TRIES=30
TRIES=0
while [ $TRIES -lt $MAX_TRIES ]; do
    if docker-compose logs mysql | grep -q "ready for connections"; then
        echo -e "${GREEN}MySQLが起動しました！${NC}"
        break
    fi
    echo "待機中... ($((TRIES+1))/$MAX_TRIES)"
    TRIES=$((TRIES+1))
    sleep 2
done

if [ $TRIES -eq $MAX_TRIES ]; then
    echo -e "${RED}MySQLの起動を待機中にタイムアウトしました。${NC}"
    echo "MySQLのログを確認してください: docker-compose logs mysql"
fi

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
