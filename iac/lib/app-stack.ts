import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as secretsManager from 'aws-cdk-lib/aws-secretsmanager';

import { Construct } from 'constructs';
import path = require('path');

export class AppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    if (process.env.LINE_CHANNEL_SECRET === undefined) {
      throw new Error("`LINE_CHANNEL_SECRET`が設定されていません")
    }
    const mainapp = new lambda.Function(this, 'ftft-mainapp', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'dist/src/entrypoint/serverless.handler',
      // node_modulesを含める必要があるため
      code: lambda.Code.fromAsset(path.join(__dirname, '../../backend/lambda-deploy-package')),
      environment: {
        NO_COLOR: "true",
        JWT_SECRET: "awsome_jwt_secret",
        TZ: "Asia/Tokyo",
        LINE_CHANNEL_SECRET: process.env.LINE_CHANNEL_SECRET
      },
      
      timeout: cdk.Duration.seconds(60)
    });

    // API Gatewayを作成
    const api = new apigateway.RestApi(this, 'ftft-apigateway', {
      restApiName: 'ftft',
    });

    // LambdaとAPI Gatewayを統合
    const lambdaIntegration = new apigateway.LambdaIntegration(mainapp);

    // ルート(/)に対するメソッドを作成し、Lambdaと統合
    const rootMethod = api.root.addMethod('ANY', lambdaIntegration, {
      apiKeyRequired: false,
    });
    api.root.addProxy({
      anyMethod: true,
      defaultIntegration: lambdaIntegration,
    });


    const userTable = new dynamodb.Table(this, "userTable", {
      tableName: "users",
      partitionKey: {
        name: "id",
        type: dynamodb.AttributeType.STRING
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST
    })

    userTable.addGlobalSecondaryIndex({
      indexName: "email",
      partitionKey: {
        name: "email",
        type: dynamodb.AttributeType.STRING
      },
    })

    userTable.addGlobalSecondaryIndex({
      indexName: "lineUserId",
      partitionKey: {
        name: "lineUserId",
        type: dynamodb.AttributeType.STRING
      },
    })

    const ftftTable = new dynamodb.Table(this, "ftftTable", {
      tableName: "ftft",
      partitionKey: {
        name: "id",
        type: dynamodb.AttributeType.STRING
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST
    })

    ftftTable.addGlobalSecondaryIndex({
      indexName: "latest",
      partitionKey: {
        name: "userId",
        type: dynamodb.AttributeType.STRING
      },
      sortKey: {
        name: "createdAt",
        type: dynamodb.AttributeType.STRING
      }
    })

    userTable.grantFullAccess(mainapp)
    ftftTable.grantFullAccess(mainapp)

    const ftftUserFilesBucket = new s3.Bucket(this, "ftftUserFilesBucket", {
      bucketName: "ftft-user-files",
    })

    ftftUserFilesBucket.addCorsRule({
      allowedHeaders: ["*"],
      allowedMethods: [s3.HttpMethods.GET, s3.HttpMethods.PUT,s3.HttpMethods.HEAD],
      allowedOrigins: ["http://localhost:5173", "https://d3ozb6rt05ntqw.cloudfront.net"]
    })

    ftftUserFilesBucket.grantReadWrite(mainapp)
  }
}
