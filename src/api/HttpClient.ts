import axios, { AxiosInstance, AxiosResponse } from 'axios';

import { AbstractClient } from '~/src/api/AbstractClient';
import { FileMetadata } from '~/src/files/metadata';
import { Namespace } from '~/src/models/Model';
import { ModelSchema } from '~/src/models/schema';


export class HttpClient extends AbstractClient {
  client: AxiosInstance;

  constructor() {
    super();
    this.client = axios.create({
      baseURL: '',
      timeout: 2 * 1000,
      responseType: 'json',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
  }

  processResponse(response: AxiosResponse): AxiosResponse {
    const error = (details: string) => new Error(`${response.request.method} ${response.request.url} failed: ${details}`);

    if (!('data' in response)) {
      throw error('Incomplete `response`. No `data` found.');
    }

    return response;
  }

  async retrieve<N extends Namespace>(namespace: N, uuid: string): Promise<ModelSchema[N] | null> {
    const response: { data: ModelSchema[N] | null } = this.processResponse(await this.client.get(`/api/${namespace}/${uuid}`));

    return response.data;
  }

  async list<N extends Namespace>(namespace: N): Promise<ModelSchema[N][]> {
    const response: { data: ModelSchema[N][] } = this.processResponse(await this.client.get(`/api/${namespace}`));

    return response.data;
  }

  async create<N extends Namespace>(namespace: N, values: ModelSchema[N]): Promise<ModelSchema[N]> {
    const response: { data: ModelSchema[N] } = this.processResponse(await this.client.post(`/api/${namespace}`, values));

    return response.data;
  }

  async update<N extends Namespace>(namespace: N, uuid: string, values: ModelSchema[N]): Promise<ModelSchema[N]> {
    const response: { data: ModelSchema[N] } = this.processResponse(await this.client.put(`/api/${namespace}/${uuid}`, values));

    return response.data;
  }

  async remove<N extends Namespace>(namespace: N, uuid: string): Promise<void> {
    this.processResponse(await this.client.delete(`/api/${namespace}/${uuid}`));
  }

  async uploadFile<N extends Namespace>(namespace: N, uuid: string, metadata: FileMetadata, file: File | Buffer): Promise<string> {
    this.processResponse(await this.client.post(`/api/${namespace}/${uuid}/upload`, { metadata, file }));

    return '';
  }

  async deleteFile<N extends Namespace>(namespace: N, uuid: string, _metadata: FileMetadata): Promise<void> {
    this.processResponse(await this.client.delete(`/api/${namespace}/${uuid}/upload`));
  }

  async downloadFile<N extends Namespace>(namespace: N, uuid: string, _metadata: FileMetadata): Promise<string> {
    this.processResponse(await this.client.get(`/api/${namespace}/${uuid}/download`));

    return '';
  }

}
