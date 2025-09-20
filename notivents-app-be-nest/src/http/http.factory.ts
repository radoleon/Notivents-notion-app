import { Injectable } from '@nestjs/common'
import axios, { AxiosInstance } from 'axios'

@Injectable()
export class HttpFactory {
  private _httpClient: AxiosInstance

  constructor() {
    this._httpClient = axios.create()
  }

  get client(): AxiosInstance {
    return this._httpClient
  }
}
