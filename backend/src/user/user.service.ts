import { Injectable } from '@nestjs/common';
import { DynamodbService } from 'src/dynamodb/dynamodb.servuce';
import { UserSchema } from './user.entity';

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
    return UserSchema.parse(userResult[0]);
  }
}
