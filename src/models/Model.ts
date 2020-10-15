import { v4 } from 'uuid';

import { Http404 } from '~/src/errors/http/Http404';
import { client } from '~/src/state/service';
import { FileMetadata } from '~/src/files/metadata';
import type { Namespace } from '~/src/models/schema';

/**
 * Props for the Model
 */
export interface ModelProps {
  uuid?: string;
}

export interface WithFileAttached {
  fileId?: string;
  data?: string;
  meta: FileMetadata;
}

export const isWithFileAttached = (instance: unknown): instance is WithFileAttached => {
  if (typeof instance !== 'object') {
    return false;
  }

  if (!instance) {
    return false;
  }

  if (!('meta' in instance)) {
    return false;
  }
  if (!('fileId' in instance)) {
    return false;
  }

  return true;
};


/**
 * Generates a model base class
 * @param namespace
 * @param fields
 */
export const modelize = <T extends ModelProps>(namespace: Namespace, fields: Array<keyof Required<T>>) => {
  class Model {
    public static namespace = 'models';
    public static fields = fields;
    public created: boolean;
    public uuid: string;

    constructor(props: T) {
      this.created = Boolean(props.uuid);
      this.uuid = props.uuid ?? v4();
    }

    static get client() {
      return client.value;
    }

    get client() {
      return (this.constructor as typeof Model).client;
    }

    get $values(): Required<T> {
      const entries = fields.map(key => [key, this[key as keyof ThisType<T>]]);

      return Object.fromEntries(entries);
    }

    static async retrieve<Y extends Model>(this: new (props: T) => Y,uuid: string): Promise<Y> {
      const values = await client.value.retrieve<T>(namespace, uuid);

      if (!values) {
        const errorCode = `${namespace}__not_found`;
        const message = `Could not find any ${namespace} with UUID: '${uuid}'`;

        throw new Http404(errorCode, message);
      }

      const instance = new this(values);

      if (isWithFileAttached(instance) && instance.fileId) {
        instance.data = await client.value.downloadFile(namespace, uuid, instance.meta);
      }

      return instance;
    }

    static async list<Y>(this: new (props: T) => Y): Promise<Y[]> {
      const list = await client.value.list<T>(namespace);
      const instances = Promise.all(
        list.map(async (values) => {
          const instance = new this(values);

          if (isWithFileAttached(instance) && instance.fileId) {
            instance.data = await client.value.downloadFile(namespace, values.uuid as string, instance.meta);
          }

          return instance;
        }),
      );

      return instances;
    }

    async save() {
      if (this.created) {
        return this.client.update<T>(namespace, this.uuid, this.$values);
      }

      const response = await this.client.create<T>(namespace, this.$values);
      this.created = true;

      return response;
    }

    async remove() {
      const response = await this.client.remove<T>(namespace, this.uuid);
      this.created = false;

      return response;
    }
  }

  return Model;
};
