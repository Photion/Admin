import { FileMetadata } from '~/src/files/metadata';


export abstract class AbstractClient {
  abstract async retrieve<T>(namespace: string, uuid: string): Promise<Required<T> | null>;
  abstract async list<T>(namespace: string): Promise<Required<T>[]>;
  abstract async create<T>(namespace: string, values: Required<T>): Promise<Required<T>>;
  abstract async update<T>(namespace: string, uuid: string, values: Required<T>): Promise<Required<T>>;
  abstract async remove<T>(namespace: string, uuid: string): Promise<void>;
  abstract async uploadFile<T>(namespace: string, uuid: string, metadata: FileMetadata, file: File | Buffer): Promise<void>
  abstract async deleteFile<T>(namespace: string, uuid: string, metadata: FileMetadata): Promise<void>

  get prefix() {
    return '/';
  }

  /**
   * Returns the file key
   * @param namespace
   * @param uuid
   * @param meta
   */
  getFileKey(namespace: string, uuid: string, meta: FileMetadata): string {
    const ext = (meta.mime.split('/').pop() ?? 'txt').toLowerCase();
    const key = `media/${namespace}/${uuid}.${ext}`;

    return key;
  }

  /**
   * Returns file URL
   * @param namespace
   * @param uuid
   * @param meta
   */
  getFileUrl(namespace: string, uuid: string, meta: FileMetadata): string {
    const key = this.getFileKey(namespace, uuid, meta);

    return `${this.prefix}${key}`;
  }
}
