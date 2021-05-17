import { Injectable } from '@nestjs/common';

import { AlkoClient } from '../../clients/alko';

@Injectable()
export class StoreService {
  private alkoClient: AlkoClient;

  constructor(alkoClient: AlkoClient) {
    this.alkoClient = alkoClient;
  }

  async getStore(id: string) {
    const store = await this.alkoClient.getStore(id);
    return store;
  }

  async searchStores(searchphrase: string) {
    const stores = await this.alkoClient.searchStores(searchphrase);
    return stores;
  }
}
