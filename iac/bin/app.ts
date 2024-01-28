import * as cdk from 'aws-cdk-lib';
import { AppStack } from '../lib/app-stack';
import { FrontendStack } from '../lib/frontend-stack';
import * as dotenv from 'dotenv';

dotenv.config()

const app = new cdk.App();

new AppStack(app, 'FtftStack', {});

new FrontendStack(app, 'FrontendStack')
