import ky from 'ky';

export interface Store {
  id: string;
  name: string;
  address: string;
}

export interface Product {
  id: string;
  name: string;
  type: string;
  producer: string;
  country: string;
  abv: string;
  size: string;
  productUrl: string;
  imageUrl: string;
  packaging: 'single' | 'multi';
  untappdBeerId: number | null;
  untappdRatingScore: number | null;
  untappdRatingCount: number | null;
  untappdBeerSlug: string | null;
}

export class ApiClient {
  private client: typeof ky;

  constructor() {
    this.client = ky.extend({
      prefixUrl: '/api'
    });
  }

  async searchStores(searchphrase: string) {
    const response = await this.client
      .get('stores', {
        searchParams: {
          search: searchphrase
        }
      })
      .json<Store[]>();

    return response;
  }

  async getStoreProducts(storeId: string) {
    const response = await this.client.get(`stores/${storeId}/products`).json<Product[]>();

    return response;
  }
}
