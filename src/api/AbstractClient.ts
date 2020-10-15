import { FileMetadata } from '~/src/files/metadata';
import { Namespace } from '~/src/models/schema';

export abstract class AbstractClient {
  abstract async retrieve<T>(namespace: Namespace, uuid: string): Promise<Required<T> | null>;
  abstract async list<T>(namespace: Namespace): Promise<Required<T>[]>;
  abstract async create<T>(namespace: Namespace, values: Required<T>): Promise<Required<T>>;
  abstract async update<T>(namespace: Namespace, uuid: string, values: Required<T>): Promise<Required<T>>;
  abstract async remove<T>(namespace: Namespace, uuid: string): Promise<void>;
  abstract async uploadFile<T>(namespace: Namespace, uuid: string, metadata: FileMetadata, file: File | Buffer): Promise<string>
  abstract async deleteFile<T>(namespace: Namespace, uuid: string, metadata: FileMetadata): Promise<void>
  abstract async downloadFile(namespace: Namespace, uuid: string, metadata: FileMetadata): Promise<string>;

  get prefix() {
    return '/';
  }

  /**
   * Returns the file key
   * @param namespace
   * @param uuid
   * @param meta
   */
  getFileKey(namespace: Namespace, uuid: string, meta: FileMetadata): string {
    const ext = (meta.mime.split('/').pop() ?? 'txt').toLowerCase();
    const key = `media/${namespace}/${uuid}.${ext}`;

    return key;
  }

  getFileSignature(_namespace: Namespace, _uuid: string, _meta: FileMetadata): string {
    return '';
  }

  /**
   * Returns file URL
   * @param namespace
   * @param uuid
   * @param meta
   */
  getFileUrl(namespace: Namespace, uuid: string, meta: FileMetadata): string {
    const key = this.getFileKey(namespace, uuid, meta);
    const signature = this.getFileSignature(namespace, uuid, meta);

    return `${this.prefix}${key}${signature}`;
  }
}
