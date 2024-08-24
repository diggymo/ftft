import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { STS } from '@aws-sdk/client-sts';

import {tracer} from "../common/tracer"

@Injectable()
export class StorageService {
  private client: S3Client;
  constructor() {
    this.client = tracer.captureAWSv3Client(new S3Client({ region: 'ap-northeast-3' }));

    const sts = new STS();
    sts.getCallerIdentity({}).catch((error) => {
      console.error('AWSにログインしていないため、ファイルを取得・保存できません', error);
    });
  }

  public async getGettingObjectUrl({ key }: { key: string }) {
    const input = {
      Bucket: 'ftft-user-files',
      Key: key,
    };
    const command = new GetObjectCommand(input);
    // const response = await this.client.send(command)

    const url = await getSignedUrl(this.client, command, {
      expiresIn: 60 * 60,
    });

    return url;
  }

  public async getPuttingObjectUrl({ key, contentType }: { key: string; contentType: string }) {
    const input = {
      Bucket: 'ftft-user-files',
      Key: key,
      // ContentType: contentType,
    };
    const command = new PutObjectCommand(input);
    const url = await getSignedUrl(this.client, command, {
      expiresIn: 60 * 60 * 24,
    });

    return url;
  }
}
