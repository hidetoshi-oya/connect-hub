#!/bin/bash

# 色の定義
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}ConnectHub社内報システム停止スクリプト${NC}"
echo "----------------------------------------"

# コンテナを停止
echo -e "${YELLOW}コンテナを停止しています...${NC}"
docker stop connect-hub-mysql connect-hub-backend connect-hub-frontend

# コンテナを削除
echo -e "${YELLOW}コンテナを削除しています...${NC}"
docker rm connect-hub-mysql connect-hub-backend connect-hub-frontend

echo -e "${GREEN}システムの停止が完了しました${NC}"
echo "----------------------------------------"
