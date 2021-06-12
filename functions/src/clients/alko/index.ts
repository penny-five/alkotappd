import { Agent as HttpAgent } from 'http';
import { Agent as HttpsAgent } from 'https';
import querystring from 'querystring';

import { Injectable } from '@nestjs/common';
import cheerio from 'cheerio';
import got from 'got';

import { AlkoProduct, AlkoStore } from './types';
import { getPackagingType, sanitizeProductName } from './utils';

@Injectable()
export class AlkoClient {
  private static readonly BEER_CATEGORY_ID = 'yW3AqHh4ul0AAAFVIGocppid';

  private websiteClient: typeof got;

  private intershopApiClient: typeof got;

  constructor() {
    this.websiteClient = got.extend({
      prefixUrl: 'https://www.alko.fi',
      agent: {
        http: new HttpAgent({ keepAlive: true }),
        https: new HttpsAgent({ keepAlive: true })
      }
    });

    this.intershopApiClient = got.extend({
      prefixUrl: 'https://www.alko.fi/INTERSHOP/web/WFS/Alko-OnlineShop-Site/fi_FI/-/EUR',
      agent: {
        http: new HttpAgent({ keepAlive: true }),
        https: new HttpsAgent({ keepAlive: true })
      }
    });
  }

  async searchStores(searchphrase: string) {
    const { body } = await this.intershopApiClient.post('ALKO_ViewStoreLocator-Dispatch', {
      form: {
        search: '',
        SearchTerm: searchphrase
      }
    });

    const $ = cheerio.load(body);

    const stores: AlkoStore[] = $('.store-choice')
      .map((_index, el) => ({
        id: $(el).find('input:radio').attr('data-store-id')!,
        name: $(el).find('label').text().trim(),
        address: $(el).find('.radio-content').text().trim()
      }))
      .get();

    return stores;
  }

  async getStore(id: string): Promise<AlkoStore> {
    const { body } = await this.websiteClient.get(`myymalat-palvelut/${id}`);

    const $ = cheerio.load(body);

    const name = $('.store-info .store-name').text().trim();
    const address = $('.store-info [itemprop=address]').text().trim();

    return {
      id,
      name,
      address
    };
  }

  async getProductPage(page: number, filters?: { storeId: number }) {
    const { body } = await this.intershopApiClient.get('ViewParametricSearch-ProductPagingRandom', {
      searchParams: {
        SortingAttribute: 'name-asc',
        PageSize: 12,
        PageNumber: page,
        SearchParameter: querystring.encode({
          ContextCategoryUUID: AlkoClient.BEER_CATEGORY_ID,
          productInStore: filters?.storeId
        })
      }
    });

    const $ = cheerio.load(body);

    const results: AlkoProduct[] = $('.product-data-container')
      .map((_index, el) => {
        const productData: {
          id: string;
          name: string;
          producer: string;
          alcohol: string;
          size: string;
        } = JSON.parse($(el).attr('data-product-data')!);

        const productUrl = $(el).find('.js-product-link').attr('href')!.trim();

        const imageUrl = $(el).find('imgproduct').attr('src')?.trim() ?? null;

        const typeAndCountry = $(el).find('.mc-taste-type-and-country').text().trim();

        const name = sanitizeProductName(productData.name.trim());

        const product: AlkoProduct = {
          id: productData.id,
          name,
          type: typeAndCountry.split('/')[0].trim(),
          producer: productData.producer.trim(),
          country: typeAndCountry.split('/')[1].trim(),
          abv: productData.alcohol,
          size: productData.size,
          productUrl,
          imageUrl,
          packaging: getPackagingType(name)
        };

        return product;
      })
      .get();

    return { results, isLastPage: results.length < 12 };
  }
}
