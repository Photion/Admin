import * as zod from 'zod';

import { isWithFileAttached, Model, Namespace } from '~/src/models/Model';
import { ModelSchema, Props } from '~/src/models/schema';
import { FileMetadata } from '~/src/files/metadata';
import { Http404 } from '~/src/errors/http/Http404';


export type Schema = ReturnType<typeof zod.object>;

export abstract class AbstractClient {
  abstract async retrieve<N extends Namespace>(namespace: N, uuid: string): Promise<ModelSchema[N] | null>;
  abstract async list<N extends Namespace>(namespace: N): Promise<ModelSchema[N][]>;
  abstract async create<N extends Namespace>(namespace: N, values: ModelSchema[N]): Promise<ModelSchema[N]>;
  abstract async update<N extends Namespace>(namespace: N, uuid: string, values: ModelSchema[N]): Promise<ModelSchema[N]>;
  abstract async remove<N extends Namespace>(namespace: N, uuid: string): Promise<void>;
  abstract async uploadFile<N extends Namespace>(namespace: N, uuid: string, metadata: FileMetadata, file: File | Buffer): Promise<string>;
  abstract async deleteFile<N extends Namespace>(namespace: N, uuid: string, metadata: FileMetadata): Promise<void>;
  abstract async downloadFile<N extends Namespace>(namespace: N, uuid: string, metadata: FileMetadata): Promise<string>;

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

export class Client<T extends AbstractClient> {

  api: T;

  constructor(api: T) {
    this.api = api;
  }

  async build<P extends Props>(model: Model<P>, values: P): Promise<P> {
    const instance = await model.schema.validate(values);

    if (isWithFileAttached(instance) && instance.file?.id) {
      instance.file.data = await this.api.downloadFile(model.namespace, instance.uuid as string, instance.meta);
    }

    return instance;
  }

  async retrieve<P extends Props>(model: Model<P>, uuid: string): Promise<P> {
    const values = (await this.api.retrieve(model.namespace, uuid));

    if (!values) {
      const errorCode = `${model.namespace}__not_found`;
      const message = `Could not find any ${model.namespace} with UUID: '${uuid}'`;

      throw new Http404(errorCode, message);
    }

    return this.build<P>(model, values as P);
  }

  async list<P extends Props>(model: Model<P>): Promise<P[]> {
    const valuesList = await this.api.list(model.namespace);

    return Promise.all(valuesList.map((values) => this.build<P>(model, values as P)));
  }

  async save<P extends Props>(model: Model<P>, values: P & { uuid: string }): Promise<P> {
    const payload = { ...values };

    if (isWithFileAttached(payload)) {
      payload.file = { id: payload.file.id };
    }

    if (values.created) {
      return this.api.update(model.namespace, values.uuid, payload) as Promise<P>;
    }

    values.created = Date.now();
    payload.created = values.created;

    return this.api.create(model.namespace, payload) as Promise<P>;
  }

  async remove<P extends Props>(model: Model<P>, uuid: string): Promise<void> {
    return this.api.remove(model.namespace, uuid);
  }

}
