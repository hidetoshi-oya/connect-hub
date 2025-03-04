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
docker-compose down

# 残存するコンテナを強制的に停止・削除
echo -e "${YELLOW}残存するコンテナを確認・削除しています...${NC}"
if [ "$(docker ps -a -q -f name=connect-hub)" ]; then
  docker stop $(docker ps -a -q -f name=connect-hub)
  docker rm $(docker ps -a -q -f name=connect-hub)
fi

# ボリュームを削除
echo -e "${YELLOW}関連するボリュームを削除しています...${NC}"
if [ "$(docker volume ls -q -f name=connect-hub)" ]; then
  docker volume rm $(docker volume ls -q -f name=connect-hub)
fi

# バックエンドとフロントエンドの特定ボリュームを削除
if [ "$(docker volume ls -q -f name=backend_node_modules)" ]; then
  docker volume rm backend_node_modules
fi
if [ "$(docker volume ls -q -f name=frontend_node_modules)" ]; then
  docker volume rm frontend_node_modules
fi

# 全てのプロジェクト関連ボリュームを削除
if [ "$(docker volume ls -q -f name=connecthub)" ]; then
  docker volume rm $(docker volume ls -q -f name=connecthub)
fi

# イメージを削除
echo -e "${YELLOW}関連するイメージを削除しています...${NC}"
if [ "$(docker images -q connect-hub-backend)" ]; then
  docker rmi connect-hub-backend
fi
if [ "$(docker images -q connect-hub-frontend)" ]; then
  docker rmi connect-hub-frontend
fi

echo -e "${GREEN}クリーンアップが完了しました！${NC}"
echo "----------------------------------------"
echo "次のコマンドを実行してシステムを再起動してください："
echo "./run.sh"
