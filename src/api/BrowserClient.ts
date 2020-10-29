import { AbstractClient } from '~/src/api/AbstractClient';
import { FileMetadata } from '~/src/files/metadata';
import { Namespace } from '~/src/models/Model';
import { ModelSchema } from '~/src/models/schema';

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

  getTable(namespace: Namespace): InMemoryTable {
    if (!(namespace in this.db)) {
      this.db[namespace] = {};
    }

    return this.db[namespace];
  }

  async retrieve<N extends Namespace>(namespace: N, uuid: string): Promise<ModelSchema[N] | null> {
    const table = this.getTable(namespace);

    const instance = (table[uuid]?.values || null) as ModelSchema[N] | null;

    return instance;
  }

  async list<N extends Namespace>(namespace: N): Promise<ModelSchema[N][]> {
    const table = this.getTable(namespace);

    const instances = Object.values(table).map((row) => row.values) as ModelSchema[N][];

    return instances;
  }

  async create<N extends Namespace>(namespace: N, values: ModelSchema[N]): Promise<ModelSchema[N]> {
    const table = this.getTable(namespace);

    table[values.uuid] =  { values, file: null };

    return values;
  }

  async update<N extends Namespace>(namespace: N, uuid: string, values: ModelSchema[N]): Promise<ModelSchema[N]> {
    const table = this.getTable(namespace);

    if (!(uuid in table)) {
      throw new Error('Instance has not been created.');
    }

    return values;
  }

  async remove<N extends Namespace>(namespace: N, uuid: string): Promise<void> {
    const table = this.getTable(namespace);

    delete table[uuid];
  }

  async uploadFile<N extends Namespace>(namespace: N, uuid: string, metadata: FileMetadata, file: File | Buffer): Promise<string> {
    const table = this.getTable(namespace);

    if (!(uuid in table)) {
      throw new Error('Instance has not been created.');
    }

    table[uuid].file = { file, metadata };

    return uuid;
  }

  async deleteFile<N extends Namespace>(namespace: N, uuid: string, _metadata: FileMetadata): Promise<void> {
    const table = this.getTable(namespace);

    if (!(uuid in table)) {
      throw new Error('Instance has not been created.');
    }

    table[uuid].file = null;
  }

  async downloadFile<N extends Namespace>(namespace: N, uuid: string, _metadata: FileMetadata): Promise<string> {
    const table = this.getTable(namespace);

    if (!(uuid in table)) {
      throw new Error('Instance has not been created.');
    }

    return String(table[uuid].file);
  }
}
