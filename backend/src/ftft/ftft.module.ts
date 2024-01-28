import { Module } from '@nestjs/common';
import { FtftController } from './ftft.controller';
import { FtftService } from './ftft.service';
import { DynamodbModule } from 'src/dynamodb/dynamodb.module';
import { StorageModule } from 'src/storage/storage.module';

@Module({
  imports: [DynamodbModule, StorageModule],
  controllers: [FtftController],
  providers: [FtftService],
})
export class FtftModule {}
