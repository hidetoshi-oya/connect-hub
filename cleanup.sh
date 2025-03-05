#!/bin/bash

# 色の定義
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}ConnectHub システム完全クリーンアップスクリプト${NC}"
echo "----------------------------------------"

# Docker Composeを使用してコンテナを停止・削除
echo -e "${YELLOW}Docker Composeでコンテナを停止・削除しています...${NC}"
docker-compose down -v

# 残存するコンテナを強制的に停止・削除
echo -e "${YELLOW}残存するコンテナを確認・削除しています...${NC}"
if [ "$(docker ps -a -q -f name=connect-hub)" ]; then
  docker stop $(docker ps -a -q -f name=connect-hub)
  docker rm $(docker ps -a -q -f name=connect-hub)
fi

# 特定のボリュームを削除
echo -e "${YELLOW}関連するボリュームを削除しています...${NC}"

# 全てのConnect-Hub関連ボリュームを明示的に削除
VOLUMES_TO_REMOVE=(
  "connect-hub_mysql_data"
  "connect-hub_backend_logs"
  "connect-hub_frontend_logs"
  "connect-hub-mysql_data"
  "backend_logs"
  "frontend_logs"
  "mysql_data"
  "backend_node_modules"
  "frontend_node_modules"
)

for volume in "${VOLUMES_TO_REMOVE[@]}"; do
  if docker volume ls -q | grep -q "$volume"; then
    echo "ボリューム $volume を削除しています..."
    docker volume rm "$volume"
  fi
done

# プルーニングでDanglingボリュームも削除
echo -e "${YELLOW}未使用のボリュームを削除しています...${NC}"
docker volume prune -f

# イメージを削除
echo -e "${YELLOW}関連するイメージを削除しています...${NC}"
if [ "$(docker images -q connect-hub-backend)" ]; then
  docker rmi connect-hub-backend
fi

if [ "$(docker images -q connect-hub-frontend)" ]; then
  docker rmi connect-hub-frontend
fi

if [ "$(docker images -q "*connect-hub*")" ]; then
  docker rmi $(docker images -q "*connect-hub*")
fi

# MySQLデータの物理的なクリーンアップ
echo -e "${YELLOW}MySQLデータの物理的なクリーンアップをしています...${NC}"
if [ -d "/var/lib/docker/volumes/*mysql_data*" ]; then
  sudo rm -rf /var/lib/docker/volumes/*mysql_data*
fi

# システムのディスク空き容量確認
echo -e "${YELLOW}システムのディスク空き容量を確認しています...${NC}"
df -h /

# Dockerシステムのクリーンアップ
echo -e "${YELLOW}Dockerシステムのクリーンアップを実行しています...${NC}"
docker system prune -f

echo -e "${GREEN}クリーンアップが完了しました！${NC}"
echo "----------------------------------------"
echo "次のコマンドを実行してシステムを再起動してください："
echo "./run.sh"
