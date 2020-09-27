import { AbstractClient } from '~/src/api/AbstractClient';
import { FileMetadata } from '~/src/files/metadata';

interface InMemoryTable {
  [key: string]: {
    values: unknown;
    file: {
      metadata: FileMetadata;
      file: File | Buffer;
    } | null;
  };
}

interface InMemoryDB {
  [key: string]: InMemoryTable;
}


export class BrowserClient extends AbstractClient {
  db: InMemoryDB;

  constructor() {
    super();
    this.db = (window as unknown as { BROWSER_CLIENT_STARTING_STATE: InMemoryDB }).BROWSER_CLIENT_STARTING_STATE || {};
  }

  getTable(namespace: string): InMemoryTable {
    if (!(namespace in this.db)) {
      this.db[namespace] = {};
    }

    return this.db[namespace];
  }

  async retrieve<T>(namespace: string, uuid: string): Promise<Required<T> | null> {
    const table = this.getTable(namespace);

    const instance = (table[uuid]?.values || null) as Required<T> | null;

    return instance;
  }

  async list<T>(namespace: string): Promise<Required<T>[]> {
    const table = this.getTable(namespace);

    const instances = Object.values(table).map((row) => row.values) as Required<T>[];

    return instances;
  }

  async create<T>(namespace: string, values: Required<T> & { uuid: string }): Promise<Required<T>> {
    const table = this.getTable(namespace);

    table[values.uuid] =  { values, file: null };

    return values;
  }

  async update<T>(namespace: string, uuid: string, values: Required<T>): Promise<Required<T>> {
    const table = this.getTable(namespace);

    if (!(uuid in table)) {
      throw new Error('Instance has not been created.');
    }

    return values;
  }

  async remove<T>(namespace: string, uuid: string): Promise<void> {
    const table = this.getTable(namespace);

    delete table[uuid];
  }

  async uploadFile<T>(namespace: string, uuid: string, metadata: FileMetadata, file: File): Promise<void> {
    const table = this.getTable(namespace);

    if (!(uuid in table)) {
      throw new Error('Instance has not been created.');
    }

    table[uuid].file = { file, metadata };
  }

  async deleteFile<T>(namespace: string, uuid: string, _metadata: FileMetadata): Promise<void> {
    const table = this.getTable(namespace);

    if (!(uuid in table)) {
      throw new Error('Instance has not been created.');
    }

    table[uuid].file = null;
  }
}
