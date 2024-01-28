import { Module } from '@nestjs/common';
import { LineLoginModule } from './linelogin/linelogin.module';

@Module({
  imports: [LineLoginModule],
})
export class SocialLoginModule {}
