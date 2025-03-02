# 社内報システム Docker環境セットアップガイド

このガイドでは、Docker と MySQL を使用して社内報システム（ConnectHub）の開発・テスト環境をセットアップする方法を説明します。

## 前提条件

- Docker と Docker Compose がインストールされていること
- Git がインストールされていること

## システム構成

システムは以下の3つのコンテナで構成されています：

1. **MySQL** - データベースサーバー
2. **Backend** - Node.js + Express バックエンドAPI
3. **Frontend** - React + TypeScript フロントエンド

## クイックスタート

```bash
# リポジトリをクローン
git clone https://github.com/hidetoshi-oya/connect-hub.git
cd connect-hub

# 実行権限を付与
chmod +x run.sh

# 起動スクリプトを実行
./run.sh
```

起動スクリプトによってシステムが正常に起動すると、以下のURLでアクセスできます：

- フロントエンド: http://localhost:3000
- バックエンドAPI: http://localhost:5000/api

## 初期アカウント

テスト用に以下のアカウントが登録されています：

| ロール | メールアドレス | パスワード | 部署 |
|--------|----------------|------------|------|
| 管理者 | admin@example.com | password | IT部 |
| モデレーター | moderator@example.com | password | 人事部 |
| 投稿者 | yamada@example.com | password | 営業部 |
| 投稿者 | sato@example.com | password | 開発部 |
| 一般ユーザー | suzuki@example.com | password | マーケティング部 |
| 一般ユーザー | tanaka@example.com | password | 広報部 |

## 手動セットアップ

起動スクリプトを使用せずに手動でセットアップする場合は、以下の手順に従ってください：

### 1. 必要なディレクトリとファイルの確認

以下のディレクトリとファイルが存在することを確認してください：

```
.
├── docker-compose.yml
├── client/
│   └── Dockerfile
├── mysql/
│   └── init/
│       ├── 01-schema.sql
│       └── 02-test-data.sql
└── server/
    ├── Dockerfile
    ├── config/
    │   └── db.config.js
    └── models/
        ├── Category.js
        ├── Comment.js
        ├── Like.js
        ├── Post.js
        ├── PostCategory.js
        ├── User.js
        └── index.js
```

### 2. Docker Composeでコンテナを起動

```bash
docker-compose up -d
```

### 3. サービスの確認

```bash
# コンテナの状態を確認
docker-compose ps

# ログを確認
docker-compose logs
```

## テストデータについて

システムには以下のテストデータが登録されています：

- ユーザー: 10名（管理者、モデレーター、投稿者、一般ユーザー）
- カテゴリ: 12個（お知らせ、プロジェクト、社員インタビューなど）
- 投稿: 10件（ピン留め記事1件を含む）
- コメント: 22件
- いいね: 各投稿に複数のいいね

## トラブルシューティング

### データベース接続エラー

バックエンドからデータベースに接続できない場合は、以下を確認してください：

```bash
# MySQLコンテナのログを確認
docker-compose logs mysql

# バックエンドコンテナのログを確認
docker-compose logs backend
```

### コンテナの再起動

問題が発生した場合は、コンテナを再起動してみてください：

```bash
docker-compose restart
```

### システムの完全リセット

システムを完全にリセットするには：

```bash
# コンテナを停止して削除
docker-compose down

# ボリュームも含めて完全に削除
docker-compose down -v

# 再度起動
docker-compose up -d
```

## システムのカスタマイズ

### 環境変数の変更

`docker-compose.yml` ファイルの `environment` セクションで環境変数を変更できます。

### テストデータの変更

テストデータを変更する場合は `mysql/init/02-test-data.sql` を編集してください。

## 開発ワークフロー

1. フロントエンドやバックエンドのコードを編集
2. 変更はホットリロードされるため、自動的に反映されます
3. 新しいパッケージをインストールした場合は、コンテナの再起動が必要

```bash
# 特定のサービスを再起動
docker-compose restart backend
# または
docker-compose restart frontend
```

## システムの停止

開発が終了したらシステムを停止します：

```bash
docker-compose down
```