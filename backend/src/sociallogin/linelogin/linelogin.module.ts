import { Module } from '@nestjs/common';
import { LineLoginController } from './linelogin.controller';
import { LineLoginService } from './linelogin.servuce';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [UserModule, AuthModule],
  controllers: [LineLoginController],
  providers: [LineLoginService],
})
export class LineLoginModule {}
