import axios, { AxiosInstance, AxiosResponse } from 'axios';

import { AbstractClient } from '~/src/api/AbstractClient';
import { FileMetadata } from '~/src/files/metadata';
import { Namespace } from '~/src/models/schema';


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

  async retrieve<T>(namespace: Namespace, uuid: string): Promise<Required<T> | null> {
    const response: { data: Required<T> } = this.processResponse(await this.client.get(`/api/${namespace}/${uuid}`));

    return response.data;
  }

  async list<T>(namespace: Namespace): Promise<Required<T>[]> {
    const response: { data: Required<T>[]} = this.processResponse(await this.client.get(`/api/${namespace}`));

    return response.data;
  }

  async create<T>(namespace: Namespace, values: Required<T>): Promise<Required<T>> {
    const response: { data: Required<T> } = this.processResponse(await this.client.post(`/api/${namespace}`, values));

    return response.data;
  }

  async update<T>(namespace: Namespace, uuid: string, values: Required<T>): Promise<Required<T>> {
    const response: { data: Required<T> } = this.processResponse(await this.client.put(`/api/${namespace}/${uuid}`, values));

    return response.data;
  }

  async remove<T>(namespace: Namespace, uuid: string): Promise<void> {
    this.processResponse(await this.client.delete(`/api/${namespace}/${uuid}`));
  }

  async uploadFile<T>(namespace: Namespace, uuid: string, metadata: FileMetadata, file: File): Promise<string> {
    this.processResponse(await this.client.post(`/api/${namespace}/${uuid}/upload`, { metadata, file }));

    return '';
  }

  async downloadFile(namespace: Namespace, uuid: string, _metadata: FileMetadata): Promise<string> {
    this.processResponse(await this.client.get(`/api/${namespace}/${uuid}/download`));

    return '';
  }

  async deleteFile<T>(namespace: Namespace, uuid: string, _metadata: FileMetadata): Promise<void> {
    this.processResponse(await this.client.delete(`/api/${namespace}/${uuid}/upload`));
  }
}
