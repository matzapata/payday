import axios, { AxiosInstance } from 'axios';

export class ServerService {
  private readonly _client: AxiosInstance;

  constructor() {
    this._client = axios.create({
      baseURL: '/api',
    });
  }

  public get client() {
    return this._client;
  }
}

export const serverService = new ServerService();
