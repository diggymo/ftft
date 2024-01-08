アプリケーションです。 

システム・アプリケーションの構成に関しては[ARCHITECTURE.md](./ARCHITECTURE.md)に記載しています。

## 使い方


## 事前準備

```
# DBの準備
docker-compose up -d

# 環境変数用意
cp .env.sample .env

# パッケージインストール
yarn install

# migration
yarn prisma migrate dev

# テストデータとしてユーザーを作成します
yarn prisma db seed
```


## サーバー起動

```
# ホットリローディングあり
yarn start:dev
# ホットリローディングなし
yarn start
```

## APIのスキーマについて

APIのスキーマはOpenAPIのフォーマットで自動出力されるようになっています。

サーバー起動後に `http://localhost:3000/api`にアクセスして閲覧してください。

## 自動テストについて

以下のコマンドで実行されます。Postgresのコンテナが動作している必要があります。また、テスト用のDBが複数作成されるので注意して下さい。

```
yarn test
```
