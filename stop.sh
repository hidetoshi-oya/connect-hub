#!/bin/bash

# 色の定義
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}ConnectHub社内報システム停止スクリプト${NC}"
echo "----------------------------------------"

# Docker Composeを使用してコンテナを停止・削除
echo -e "${YELLOW}コンテナを停止・削除しています...${NC}"
docker-compose down

echo -e "${GREEN}システムの停止が完了しました${NC}"
echo "----------------------------------------"
