import { Module } from '@nestjs/common';
import { DynamodbService } from 'src/dynamodb/dynamodb.servuce';
import { FtftSchema } from './ftft.entity';
import { z } from 'zod';
import { randomUUID } from 'crypto';

const DbSchema = FtftSchema.omit({
  createdAt: true,
}).merge(
  z.object({
    createdAt: z.string().datetime({ offset: true }),
  }),
);

@Module({})
export class FtftService {
  constructor(private readonly dynamoDb: DynamodbService) {}

  createFtft({ ftft }: { ftft: { userId: string; title: string } }) {
    const ftftRecord = DbSchema.parse({
      id: randomUUID(),
      createdAt: new Date().toISOString(),
      ...ftft,
    });

    this.dynamoDb.createItem({
      TableName: 'ftft',
      Item: ftftRecord,
    });
  }

  async searchFtft(userId: string, offsetId?: string) {
    const ftfts = await this.dynamoDb.query({
      TableName: 'ftft',
      IndexName: 'latest',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId,
      },
      ExclusiveStartKey: offsetId !== undefined ? { id: offsetId } : undefined,
      ScanIndexForward: false,
    });

    return ftfts.map((item) => {
      const parsedItem = DbSchema.parse(item);
      return FtftSchema.parse({ ...parsedItem, createdAt: new Date(parsedItem.createdAt) });
    });
  }
}
