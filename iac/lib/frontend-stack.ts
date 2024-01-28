import * as cdk from 'aws-cdk-lib';
import { Bucket, BucketAccessControl } from "aws-cdk-lib/aws-s3";
import { Construct } from 'constructs';
import path = require('path');
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { Distribution } from 'aws-cdk-lib/aws-cloudfront';
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';

export class FrontendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const bucket = new Bucket(this, 'serviceSiteBucket', {
      accessControl: BucketAccessControl.PRIVATE,
    })

    const certificate = acm.Certificate.fromCertificateArn(this, "ftft-certificate", "arn:aws:acm:us-east-1:262011991733:certificate/805d453d-0747-4ebd-b5c6-c5f8697be336")

    const serviceSiteDistribution = new Distribution(this, 'serviceSiteDistribution', {
      defaultRootObject: 'index.html',
      defaultBehavior: {
        origin: new S3Origin(bucket),
      },
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
        },
      ],
      certificate: certificate,
      domainNames: ['ftft.morifuji-is.ninja'],
    })

    new BucketDeployment(this, 'serviceSiteDeployment', {
      destinationBucket: bucket,
      sources: [Source.asset(path.resolve(__dirname, './../../frontend/dist'))],
      distribution: serviceSiteDistribution,
      distributionPaths: ['/*'],
    })
    
    new cdk.CfnOutput(this, "serviceSiteUrl", {
      value: serviceSiteDistribution.distributionDomainName
    })
  }
}
