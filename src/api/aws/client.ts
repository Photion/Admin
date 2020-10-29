import S3 from 'aws-sdk/clients/s3';
import DynamoDB from 'aws-sdk/clients/dynamodb';

import { AbstractClient } from '~/src/api/AbstractClient';
import { FileMetadata, FileStorage } from '~/src/files/metadata';
import { Namespace } from '~/src/models/Model';
import { ModelSchema } from '~/src/models/schema';


export interface AwsCredentials {
  username: string;
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
}

export class AwsClient extends AbstractClient {
  credentials: AwsCredentials;

  constructor(credentials: AwsCredentials) {
    super();
    this.credentials = credentials;
  }

  get prefix() {
    const bucket = this.getBucket();
    const region = this.credentials.region;

    return `https://${bucket}.s3-${region}.amazonaws.com/`;
  }

  getTable(namespace: Namespace): string {
    const table = `photion--${this.credentials.username}--${namespace}`;

    return table;
  }

  getKey(uuid: string) {
    return {
      uuid,
    };
  }

  getBucket() {
    const bucket = `photion--${this.credentials.username}--folders`;

    return bucket;
  }

  getStorageClass(meta: FileMetadata) {
    switch (meta.storage) {
    case FileStorage.PREVIEW:
      return 'STANDARD';
    case FileStorage.FULL_QUALITY:
      return 'STANDARD_IA';
    case FileStorage.RAW:
      return 'DEEP_ARCHIVE';
    default:
      throw new Error(`Unknown storage class for: '${meta.storage}'`);
    }
  }

  getAcl(meta: FileMetadata) {
    if (meta.public) {
      return 'public-read';
    } else {
      return 'private';
    }
  }

  get s3(): S3 {
    const params = {
      ...this.credentials,
    };

    return new S3(params);
  }

  get dynamo(): DynamoDB.DocumentClient {
    const params = {
      apiVersion: '2012-08-10',
      ...this.credentials,
    };

    return new DynamoDB.DocumentClient(params);
  }

  async retrieve<N extends Namespace>(namespace: N, uuid: string): Promise<ModelSchema[N] | null> {
    const params = {
      TableName: this.getTable(namespace),
      Key: this.getKey(uuid),
    };

    const response = await this.dynamo.get(params).promise();

    if (response.Item) {
      return response.Item as ModelSchema[N];
    }

    return null;
  }

  async list<N extends Namespace>(namespace: N): Promise<ModelSchema[N][]> {
    const params = {
      TableName: this.getTable(namespace),
    };

    const response = await this.dynamo.scan(params).promise();

    if (response.Items) {
      return response.Items as ModelSchema[N][];
    }

    return [];
  }


  async create<N extends Namespace>(namespace: N, values: ModelSchema[N]): Promise<ModelSchema[N]> {
    const params = {
      TableName: this.getTable(namespace),
      Item: values,
    };

    await this.dynamo.put(params).promise();

    return values;
  }

  async update<N extends Namespace>(namespace: N, _uuid: string, values: ModelSchema[N]): Promise<ModelSchema[N]> {
    const params = {
      TableName: this.getTable(namespace),
      Item: values,
    };

    await this.dynamo.put(params).promise();

    return values;
  }

  async remove<N extends Namespace>(namespace: N, uuid: string): Promise<void> {
    const params = {
      TableName: this.getTable(namespace),
      Key: this.getKey(uuid),
    };

    await this.dynamo.delete(params).promise();
  }

  async uploadFile<N extends Namespace>(namespace: N, uuid: string, metadata: FileMetadata, file: File | Buffer): Promise<string> {
    const params = {
      Bucket: this.getBucket(),
      Key: this.getFileKey(namespace, uuid, metadata),
      Body: file,
      ACL: this.getAcl(metadata),
      StorageClass: this.getStorageClass(metadata),
      ContentType: metadata.mime,
    };

    await this.s3.putObject(params).promise();

    return params.Key;
  }

  async deleteFile<N extends Namespace>(namespace: N, uuid: string, metadata: FileMetadata): Promise<void> {
    const params = {
      Bucket: this.getBucket(),
      Key: this.getFileKey(namespace, uuid, metadata),
    };

    await this.s3.deleteObject(params).promise();
  }

  async downloadFile<N extends Namespace>(namespace: N, uuid: string, metadata: FileMetadata): Promise<string> {
    return this.getFileUrl(namespace, uuid, metadata);
  }

  headFile<N extends Namespace>(namespace: N, uuid: string, metadata: FileMetadata) {
    const params = {
      Bucket: this.getBucket(),
      Key: this.getFileKey(namespace, uuid, metadata),
    };

    return this.s3.headObject(params).promise();
  }

  /**
   * Returns file URL
   * @param namespace
   * @param uuid
   * @param meta
   */
  getFileUrl<N extends Namespace>(namespace: N, uuid: string, metadata: FileMetadata): string {
    if (metadata.public) {
      return super.getFileUrl(namespace, uuid, metadata);
    }

    const params = {
      Bucket: this.getBucket(),
      Key: this.getFileKey(namespace, uuid, metadata),
      Expires: 24 * 60 * 60,
    };

    return this.s3.getSignedUrl('getObject', params);
  }

}
