import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';

import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { setAppConfig } from './_shared';
const logger = new Logger('main');

async function bootstrap() {
  // NOTE: 開発サーバー起動時に結合テストが実行できるよう動的に変更可能に
  const port = parseInt(process.env.PORT || '3000', 10);

  logger.log(`running on port: ${port}`);
  (await setAppConfig()).listen(port);
}

bootstrap();
