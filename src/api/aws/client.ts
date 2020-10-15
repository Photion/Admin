import S3 from 'aws-sdk/clients/s3';
import DynamoDB from 'aws-sdk/clients/dynamodb';

import { HttpClient } from '~/src/api/HttpClient';
import { FileMetadata, FileStorage } from '~/src/files/metadata';
import { Namespace } from '~/src/models/schema';


export interface AwsCredentials {
  username: string;
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
}

export class AwsClient extends HttpClient {
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
    const bucket = `photion--${this.credentials.username}--concepts`;

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

  async list<T>(namespace: Namespace): Promise<Required<T>[]> {
    const params = {
      TableName: this.getTable(namespace),
    };

    const response = await this.dynamo.scan(params).promise();

    if (response.Items) {
      return response.Items as Required<T>[];
    }

    return [];
  }

  async retrieve<T>(namespace: Namespace, uuid: string): Promise<Required<T> | null> {
    const params = {
      TableName: this.getTable(namespace),
      Key: this.getKey(uuid),
    };

    const response = await this.dynamo.get(params).promise();

    if (response.Item) {
      return response.Item as Required<T>;
    }

    return null;
  }

  async create<T>(namespace: Namespace, values: Required<T>): Promise<Required<T>> {
    const params = {
      TableName: this.getTable(namespace),
      Item: values,
    };

    await this.dynamo.put(params).promise();

    return values;
  }

  async update<T>(namespace: Namespace, _uuid: string, values: Required<T>): Promise<Required<T>> {
    const params = {
      TableName: this.getTable(namespace),
      Item: values,
    };

    await this.dynamo.put(params).promise();

    return values;
  }

  async remove<T>(namespace: Namespace, uuid: string): Promise<void> {
    const params = {
      TableName: this.getTable(namespace),
      Key: this.getKey(uuid),
    };

    await this.dynamo.delete(params).promise();
  }

  async uploadFile<T>(namespace: Namespace, uuid: string, meta: FileMetadata, file: File | Buffer): Promise<string> {
    const params = {
      Bucket: this.getBucket(),
      Key: this.getFileKey(namespace, uuid, meta),
      Body: file,
      ACL: this.getAcl(meta),
      StorageClass: this.getStorageClass(meta),
      ContentType: meta.mime,
    };

    await this.s3.putObject(params).promise();

    return params.Key;
  }

  async deleteFile<T>(namespace: Namespace, uuid: string, meta: FileMetadata): Promise<void> {
    const params = {
      Bucket: this.getBucket(),
      Key: this.getFileKey(namespace, uuid, meta),
    };

    await this.s3.deleteObject(params).promise();
  }

  headFile<T>(namespace: Namespace, uuid: string, meta: FileMetadata) {
    const params = {
      Bucket: this.getBucket(),
      Key: this.getFileKey(namespace, uuid, meta),
    };

    return this.s3.headObject(params).promise();
  }

  /**
   * Returns file URL
   * @param namespace
   * @param uuid
   * @param meta
   */
  getFileUrl(namespace: Namespace, uuid: string, meta: FileMetadata): string {
    if (meta.public) {
      return super.getFileUrl(namespace, uuid, meta);
    }

    const params = {
      Bucket: this.getBucket(),
      Key: this.getFileKey(namespace, uuid, meta),
      Expires: 24 * 60 * 60,
    };

    return this.s3.getSignedUrl('getObject', params);
  }

}
