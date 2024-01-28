import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { DynamodbModule } from './dynamodb/dynamodb.module';
import { FtftModule } from './ftft/ftft.module';
import { StorageModule } from './storage/storage.module';
import { SocialLoginModule } from './sociallogin/sociallogin.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
    }),
    DynamodbModule,
    AuthModule,
    UserModule,
    StorageModule,
    SocialLoginModule,
    DynamodbModule,
    FtftModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
