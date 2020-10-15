import { AbstractClient } from '~/src/api/AbstractClient';
import * as api from '~/src/api/googleDrive/api';
import { isWithFileAttached } from '~/src/models/Model';
import { Schema, Group, Namespace, Model } from '~/src/models/schema';
import { FileMetadata } from '~/src/files/metadata';

export class GoogleDriveClient extends AbstractClient {

  static BASE_FOLDER = 'Photion';
  db: Schema | null;

  constructor() {
    super();
    this.db = null;
  }

  async getDb(ensure = false) {
    if (!this.db || ensure) {
      const databaseId = await api.getDb();
      this.db = await api.downloadFile<Schema>(databaseId, 'json');
    }

    return this.db;
  }

  async saveDb() {
    if (!this.db) {
      throw new Error('Cannot save uncreated database');
    }

    await api.updateDb(this.db);

    return this.db;
  }

  async writeDb(namespace: Namespace, uuid: string, values: Record<string, unknown> | undefined) {
    // Fetch the latest copy of the db
    // to avoid concurrency writes
    await this.getDb(true);
    const group = await this.getGroup(namespace);

    if (!group) {
      throw new Error(`Undefined namespace: '${namespace}'`);
    }

    if (values) {
      group[uuid] = values;
    } else {
      delete group[uuid];
    }
  }


  async getGroup(namespace: Namespace): Promise<Group> {
    const db = await this.getDb();
    const group = db[namespace];

    return group;
  }

  async getEntity(namespace: Namespace, uuid: string): Promise<Model | null>  {
    const group = await this.getGroup(namespace);

    return group[uuid] || null;
  }

  async retrieve<T>(namespace: Namespace, uuid: string): Promise<T> {
    const entity = await this.getEntity(namespace, uuid) as T;
    return entity;
  }

  async list<T>(namespace: Namespace): Promise<T[]> {
    const group = await this.getGroup(namespace);

    if (!group) {
      return [];
    }

    return Object.values(group) as T[];
  }

  async create<T>(namespace: Namespace, values: Required<T> & { uuid: string }): Promise<Required<T>> {
    await this.writeDb(namespace, values.uuid, values);
    await this.saveDb();
    return values;
  }

  async update<T>(namespace: Namespace, uuid: string, values: Required<T>): Promise<Required<T>> {
    await this.writeDb(namespace, uuid, values);
    await this.saveDb();
    return values;
  }

  async remove(namespace: Namespace, uuid: string): Promise<void> {
    await this.writeDb(namespace, uuid, undefined);
    await this.saveDb();
  }

  async uploadFile(namespace: Namespace, uuid: string, metadata: FileMetadata, file: File) {
    const instance = await this.getEntity(namespace, uuid);

    if (!instance) {
      throw new Error('Instance hasn\'t been saved.');
    }

    if (!isWithFileAttached(instance)) {
      throw new Error(`Cannot upload file to ${namespace}`);
    }

    const ext = (metadata.mime.split('/').pop() ?? 'txt').toLowerCase();
    const name = `${namespace}-${uuid}.${ext}`;
    const rootFolder = await api.getRootFolder();

    const googleMetadata = {
      name,
      parents: [rootFolder],
    };

    const response = await api.createFile(googleMetadata, file);

    instance.fileId = response.data.id as string;

    this.saveDb();

    return response.data.id as string;
  }

  async downloadFile(namespace: Namespace, uuid: string, metadata: FileMetadata) {
    const entity = await this.getEntity(namespace, uuid);

    if (!entity) {
      throw new Error('Could not find Entity');
    }

    if (!('fileId' in entity)) {
      throw new Error('Entity does not define a fileId');
    }
    const data = await api.downloadFile(entity.fileId as string);

    return new Promise<string>((resolve) => {
      const blob = new Blob([data], { type: metadata.mime });
      const reader = new FileReader();

      reader.onload = () => {
        const value = reader.result as string;
        return resolve(value);
      };
      reader.readAsDataURL(blob);
    });
  }

  async deleteFile(namespace: Namespace, uuid: string, _metadata: FileMetadata) {
    const entity = await this.getEntity(namespace, uuid);

    if (!entity) {
      throw new Error('Entity not found');
    }

    if (!('fileId' in entity)) {
      throw new Error('Entity does not define a fileId');
    }

    await api.deleteFile(String(entity.fileId));
  }

}
