import { Injectable } from '@nestjs/common';
import got from 'got';

import { Config } from '../../config';

@Injectable()
export class UntappdClient {
  private client: typeof got;

  constructor(config: Config) {
    this.client = got.extend({
      prefixUrl: 'https://api.untappd.com/v4/',
      searchParams: {
        client_id: config.getUntappdClientId(),
        client_secret: config.getUntappdClientSecret()
      }
    });
  }

  async searchBeer(searchphrase: string) {
    const response = await this.client
      .get({
        url: 'search/beer',
        searchParams: {
          q: searchphrase,
          sort: 'checkin',
          limit: 1
        }
      })
      .json<UntappdResponse<UntappdSearchBeerResult>>();

    return response;
  }

  async getBeerInfo(bid: number) {
    const response = await this.client
      .get({
        url: `beer/info/${bid}`,
        searchParams: {
          compact: true
        }
      })
      .json<UntappdResponse<UntappdGetBeerInfoResult>>();

    return response;
  }
}
