import { Module } from '@nestjs/common';
import { FtftController } from './ftft.controller';
import { FtftService } from './ftft.service';
import { DynamodbModule } from 'src/dynamodb/dynamodb.module';

@Module({
  imports: [DynamodbModule],
  controllers: [FtftController],
  providers: [FtftService],
})
export class FtftModule {}
