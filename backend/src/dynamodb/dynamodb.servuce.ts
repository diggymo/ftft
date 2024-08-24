import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { GetCommand, QueryCommand, ScanCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { Injectable } from '@nestjs/common';
import {tracer} from "../common/tracer"
@Injectable()
export class DynamodbService {
  private client: DynamoDBClient;
  constructor() {
    this.client = tracer.captureAWSv3Client(new DynamoDBClient({
      endpoint: process.env.DYNAMODB_ENDPOINT ?? undefined,
    }));
  }

  public async getItem({ tableName, key }: { tableName: string; key: any }) {
    const result = await this.client.send(
      new GetCommand({
        TableName: tableName,
        Key: key,
      }),
    );

    return result.Item;
  }

  public async query(props: ConstructorParameters<typeof QueryCommand>[0]) {
    const result = await this.client.send(new QueryCommand(props));
    return result.Items ?? [];
  }

  public async scan(props: ConstructorParameters<typeof ScanCommand>[0]) {
    const result = await this.client.send(new ScanCommand(props));
    return result.Items ?? [];
  }

  public async createItem(props: ConstructorParameters<typeof PutCommand>[0]) {
    const result = await this.client.send(new PutCommand(props));

    return result;
  }
}
