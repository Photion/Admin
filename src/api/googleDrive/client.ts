import { AbstractClient } from '~/src/api/AbstractClient';
import * as api from '~/src/api/googleDrive/api';
import { isWithFileAttached } from '~/src/models/Model';
import { CollectionSchema, ModelSchema } from '~/src/models/schema';
import { FileMetadata } from '~/src/files/metadata';
import { Namespace } from '~/src/models/Model';

export class GoogleDriveClient extends AbstractClient {

  static BASE_FOLDER = 'Photion';
  db: CollectionSchema | null;

  constructor() {
    super();
    this.db = null;
  }

  async getDb(ensure = false) {
    if (!this.db || ensure) {
      const databaseId = await api.getDb();
      this.db = await api.downloadFile<CollectionSchema>(databaseId, 'json');
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

  async writeDb<N extends Namespace>(namespace: N, uuid: string, values: ModelSchema[N] | undefined) {
    // Fetch the latest copy of the db
    // to avoid concurrency writes
    await this.getDb(true);
    const collection = await this.getModelCollection(namespace);

    if (!collection) {
      throw new Error(`Undefined namespace: '${namespace}'`);
    }

    if (values) {
      Object.assign(collection, { [uuid]: values });
    } else {
      delete collection[uuid];
    }
  }


  async getModelCollection<N extends Namespace>(namespace: N): Promise<CollectionSchema[N]> {
    const db = await this.getDb();
    const collection = db[namespace];

    return collection;
  }

  async getEntity<N extends Namespace>(namespace: N, uuid: string): Promise<ModelSchema[N] | null>  {
    const collection = await this.getModelCollection(namespace);

    const entity = (collection[uuid] || null) as ModelSchema[N] | null;

    return entity;
  }

  async retrieve<N extends Namespace>(namespace: N, uuid: string): Promise<ModelSchema[N] | null> {
    const entity = await this.getEntity(namespace, uuid);
    return entity;
  }

  async list<N extends Namespace>(namespace: N): Promise<ModelSchema[N][]> {
    const collection = await this.getModelCollection(namespace);

    if (!collection) {
      return [];
    }

    return Object.values(collection);
  }

  async create<N extends Namespace>(namespace: N, values: ModelSchema[N] & { uuid: string }): Promise<ModelSchema[N]> {
    await this.writeDb(namespace, values.uuid, values);
    await this.saveDb();
    return values;
  }

  async update<N extends Namespace>(namespace: N, uuid: string, values: ModelSchema[N]): Promise<ModelSchema[N]> {
    await this.writeDb(namespace, uuid, values);
    await this.saveDb();
    return values;
  }

  async remove<N extends Namespace>(namespace: N, uuid: string): Promise<void> {
    await this.writeDb(namespace, uuid, undefined);
    await this.saveDb();
  }

  async uploadFile<N extends Namespace>(namespace: N, uuid: string, metadata: FileMetadata, file: File) {
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

    instance.file.id = response.data.id as string;

    this.saveDb();

    return response.data.id as string;
  }

  async downloadFile<N extends Namespace>(namespace: N, uuid: string, metadata: FileMetadata) {
    const entity = await this.getEntity(namespace, uuid);

    if (!entity) {
      throw new Error('Could not find Entity');
    }

    if (!isWithFileAttached(entity)) {
      throw new Error(`Cannot upload file to ${namespace}`);
    }

    const data = await api.downloadFile(entity.file.id as string);

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

  async deleteFile<N extends Namespace>(namespace: N, uuid: string, _metadata: FileMetadata) {
    const entity = await this.getEntity(namespace, uuid);

    if (!entity) {
      throw new Error('Entity not found');
    }

    if (!isWithFileAttached(entity)) {
      throw new Error(`Cannot upload file to ${namespace}`);
    }

    await api.deleteFile(String(entity.file.id));
  }

}
