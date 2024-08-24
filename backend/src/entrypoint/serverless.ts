import * as serverlessExpress from '@codegenie/serverless-express';

import { Callback, Context, Handler } from 'aws-lambda';
import { setAppConfig } from './_shared';
import '../common/tracer';

let server: Handler;

async function bootstrap() {
  // NOTE: 開発サーバー起動時に結合テストが実行できるよう動的に変更可能に
  const app = await setAppConfig();

  await app.init();

  const expressApp = app.getHttpAdapter().getInstance();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return serverlessExpress({ app: expressApp });
}

export const handler: Handler = async (event: any, context: Context, callback: Callback) => {
  server = server ?? (await bootstrap());
  return server(event, context, callback);
};
