import { AlkoClient } from '../clients/alko';
import { DatabaseClient } from '../clients/database';
import { AlkoProduct } from '../clients/alko/types';
import { ScheduledTask } from '.';
import { sleep } from '../utils';

export interface SyncProductsTaskResult {
  created: number;
  updated: number;
  deleted: number;
}

export class SyncProductsTask extends ScheduledTask<SyncProductsTaskResult> {
  private alkoClient: AlkoClient;

  private databaseClient: DatabaseClient;

  constructor(alkoClient: AlkoClient, databaseClient: DatabaseClient) {
    super();
    this.alkoClient = alkoClient;
    this.databaseClient = databaseClient;
  }

  async onExecute() {
    const products: AlkoProduct[] = [];

    let page = 0;

    while (page < 5) {
      console.log('get page', page);
      const { results, isLastPage } = await this.alkoClient.getProductPage(page);

      products.push(...results);

      if (isLastPage) {
        break;
      }

      page += 1;

      sleep(1000);
    }

    const syncResult = await this.databaseClient.sync({
      entries: products.map(product => ({ id: product.id, name: product.name }))
    });

    return syncResult;
  }
}
