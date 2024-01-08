## 前提

- 記載されたCDKを実行すると、RDS, ECS(Fargate, タスク数=1), ALB, EC2(踏み台サーバー), Route53 ホストゾーン が作成します。
- 環境構築後には、ALBのURLからアプリケーションにアクセスできます。

## 事前準備

- ローカルPCにcdkがインストールされていること
- ローカルPCに[Amazon ECS Exec](https://docs.aws.amazon.com/ja_jp/AmazonECS/latest/userguide/ecs-exec.html)がインストールされていること
- アプリケーションのHTTPS化を行うために、アプリケーションで利用するドメインを用意すること
  - HTTPS化を行いたくない場合、コードをいくつかコメントアウトしデプロイすると、ALBのURLからアプリケーションにアクセスできますが、Swaggerが閲覧できないので注意してください。
- `lib/app-stack.ts`の`FIXME`の部分を自身の環境に合わせて修正すること
- 踏み台サーバー用のSSH鍵を作成しておくこと

```
aws ec2 create-key-pair \
    --key-name bastion \
    --key-type rsa \
    --query "KeyMaterial" \
    --profile ftft \
    --region ap-northeast-1 \
    --output text > bastion.pem
```

## 環境構築

```
npm install

# aws configure してある状態で以下を実行します
npm run cdk bootstrap

npm run cdk diff

# CDKを反映させます。
# 初回はACMの証明書が確認待ちの状態で止まるため、その間に権威サーバー側でRoute53への該当のホストゾーンへのNXレコードを追加してください
npm run cdk deploy

# アクセスできるか確認してください
open https://{your-domain}/healthcheck
```

## DBを初期化し初期データを投入する

踏み台サーバーを経由してRDSに接続します。

```
# ポートフォワーディング
ssh -i ./bastion2.pem  -L 5433:appstack-appdatabase727f40bc-l5c89qx6vdim.c0cqrs8z84qw.ap-northeast-1.rds.amazonaws.com:5432 ec2-user@3.112.194.98
# その後、何かしらのDBクライアントでRDSに接続
```

`backend/database/migrations/20230319053449_/migration.sql` を実行してテーブルを初期化します。

さらに、以下のSQLで初期ユーザーを作成します。このユーザーのメールアドレスは`test@example.com`、パスワードは`hoge`です。このユーザーで今後ログインすることができます。

```sql
INSERT INTO "User" (id, email, password) VALUES ('243fe524-28d2-4787-9a00-f3a83d842aba', 'test@example.com', '$2b$10$noBcSzxX3Abis8xlMwXgf.C9Fp72JaUYBIWkHg0NZ8u.n0upfeVj6');
```

以上で環境構築は終わりです。

