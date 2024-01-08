import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { DynamodbModule } from 'src/dynamodb/dynamodb.module';

@Module({
  imports: [DynamodbModule],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
