import { Injectable } from '@nestjs/common';

import { AlkoClient } from '../../clients/alko';
import { AlkoProduct } from '../../clients/alko/types';
import { DatabaseClient } from '../../clients/database';
import { Product } from './product.service.types';

@Injectable()
export class ProductService {
  private alkoClient: AlkoClient;

  private databaseClient: DatabaseClient;

  constructor(alkoClient: AlkoClient, databaseClient: DatabaseClient) {
    this.alkoClient = alkoClient;
    this.databaseClient = databaseClient;
  }

  async getAllStoreProducts(storeId: number) {
    const alkoProducts: AlkoProduct[] = [];

    let page = 0;

    while (true) {
      const { results, isLastPage } = await this.alkoClient.getProductPage(page, {
        storeId
      });

      alkoProducts.push(...results);

      if (isLastPage) {
        break;
      }

      page += 1;
    }

    const databaseEntries = await this.databaseClient.getAll();

    const products: Product[] = alkoProducts.map(alkoProduct => {
      const entry = databaseEntries.find(entry => entry.id === alkoProduct.id);
      return {
        ...alkoProduct,
        untappdRating: entry?.untappdRating ?? null,
        untappdBeerSlug: entry?.untappdBeerSlug ?? null
      };
    });

    return products;
  }
}
