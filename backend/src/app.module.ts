import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { DynamodbModule } from './dynamodb/dynamodb.module';
import { FtftModule } from './ftft/ftft.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
    }),
    DynamodbModule,
    AuthModule,
    UserModule,
    DynamodbModule,
    FtftModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
