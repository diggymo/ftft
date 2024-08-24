import { Module } from '@nestjs/common';
import { DynamodbService } from 'src/dynamodb/dynamodb.servuce';
import { Ftft, FtftDbSchema, FtftSchema } from './ftft.entity';
import { z } from 'zod';
import { randomUUID } from 'crypto';
import { StorageService } from 'src/storage/storage.servuce';

@Module({})
export class FtftService {
  constructor(private readonly dynamoDb: DynamodbService, private readonly storage: StorageService) {}

  createFtft({
    ftft,
  }: {
    ftft: {
      userId: string;
      title: string;
      fileUrls: string[];
      emoji?: string;
      location?: { lat: number; lng: number };
      doneAt?: Date;
    };
  }) {
    const fileKeyList = ftft.fileUrls.map((fileUrl) => fileUrl.split('.amazonaws.com/')[1].split('?')[0]);
    const ftftRecord = FtftDbSchema.parse({
      userId: ftft.userId,
      title: ftft.title,
      emoji: ftft.emoji,
      location: ftft.location,
      fileKeyList,
      id: randomUUID(),
      createdAt: (ftft.doneAt || new Date()).toISOString(),
    });

    this.dynamoDb.createItem({
      TableName: 'ftft',
      Item: ftftRecord,
    });
  }

  async searchFtft(userId: string, offsetId?: string, limitSize?: number): Promise<Ftft[]> {
    const ftfts = await this.dynamoDb.query({
      TableName: 'ftft',
      IndexName: 'latest',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId,
      },
      Limit: limitSize,
      ExclusiveStartKey: offsetId !== undefined ? { id: offsetId } : undefined,
      ScanIndexForward: false,
    });

    return Promise.all(
      ftfts.map((item) => {
        const parsedItem = FtftDbSchema.parse(item);

        return Promise.all(
          (parsedItem.fileKeyList ?? []).map((fileKey) => this.storage.getGettingObjectUrl({ key: fileKey })),
        ).then((urls) => {
          return {
            ...FtftSchema.parse({
              ...parsedItem,
              createdAt: new Date(parsedItem.createdAt),
            }),
            fileUrls: urls,
          };
        });
      }),
    );
  }
}

/*

{
  "password": "$2b$10$993ZZ./zDllmpsNdUZ5So.tj2Opfa2jGAs65iW2yJ8o/OxYtN3h4C",
  "email": "marooon88@gmail.com",
  "id": "61639063-727d-4109-8ac1-1ad4e35d4c3e"
}

*/
