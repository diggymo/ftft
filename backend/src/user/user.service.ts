import { Injectable } from '@nestjs/common';
import { DynamodbService } from 'src/dynamodb/dynamodb.servuce';
import { EmailUserSchema, LineUser, LineUserSchema, UserSchema } from './user.entity';
import { randomUUID } from 'crypto';

const TABLE_NAME = 'users';

@Injectable()
export class UserService {
  constructor(private readonly dynamoDb: DynamodbService) {}

  async findByEmail(email: string) {
    const userResult = await this.dynamoDb.query({
      TableName: TABLE_NAME,
      IndexName: 'email',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': email,
      },
    });

    if (userResult.length === 0) return null;
    return EmailUserSchema.parse(userResult[0]);
  }

  async createLineUser(lineUserId: string): Promise<LineUser> {
    const lineUser = await this.findByLineUserId(lineUserId);
    if (lineUser !== null) {
      return lineUser;
    }
    const lineUserParams = LineUserSchema.parse({
      id: randomUUID(),
      lineUserId,
    });

    await this.dynamoDb.createItem({
      TableName: TABLE_NAME,
      Item: lineUserParams,
    });

    return lineUserParams;
  }

  async findByLineUserId(lineUserId: string) {
    const lineUser = await this.dynamoDb.query({
      TableName: TABLE_NAME,
      IndexName: 'lineUserId',
      KeyConditionExpression: 'lineUserId = :lineUserId',
      ExpressionAttributeValues: {
        ':lineUserId': lineUserId,
      },
    });
    if (lineUser.length === 0) return null;

    return LineUserSchema.parse(lineUser[0]);
  }
}
