import axios, { AxiosInstance, AxiosResponse } from 'axios';

import { AbstractClient } from '~/src/api/AbstractClient';
import { FileMetadata } from '~/src/files/metadata';


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

    if (!response.data) {
      throw error('Incomplete `response`. No `data` found.');
    }

    if (typeof response.data === 'string') {
      throw error('Invalid `response`. `data` is a string.');
    }

    return response;
  }

  async retrieve<T>(namespace: string, uuid: string): Promise<Required<T> | null> {
    const response: { data: Required<T> } = this.processResponse(await this.client.get(`/api/${namespace}/${uuid}`));

    return response.data;
  }

  async list<T>(namespace: string): Promise<Required<T>[]> {
    const response: { data: Required<T>[]} = this.processResponse(await this.client.get(`/api/${namespace}`));

    return response.data;
  }

  async create<T>(namespace: string, values: Required<T>): Promise<Required<T>> {
    const response: { data: Required<T> } = this.processResponse(await this.client.post(`/api/${namespace}`, values));

    return response.data;
  }

  async update<T>(namespace: string, uuid: string, values: Required<T>): Promise<Required<T>> {
    const response: { data: Required<T> } = this.processResponse(await this.client.put(`/api/${namespace}/${uuid}`, values));

    return response.data;
  }

  async remove<T>(namespace: string, uuid: string): Promise<void> {
    this.processResponse(await this.client.delete(`/api/${namespace}/${uuid}`));
  }

  async uploadFile<T>(namespace: string, uuid: string, metadata: FileMetadata, file: File): Promise<void> {
    this.processResponse(await this.client.post(`/api/${namespace}/${uuid}/upload`, { metadata, file }));
  }

  async deleteFile<T>(namespace: string, uuid: string, _metadata: FileMetadata): Promise<void> {
    this.processResponse(await this.client.delete(`/api/${namespace}/${uuid}/upload`));
  }
}
