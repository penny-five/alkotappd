export interface AlkoStore {
  id: string;
  name: string;
  address: string;
}

export enum AlkoProductPackaging {
  SINGLE = 'single',
  MULTIPACK = 'multipack'
}

export interface AlkoProduct {
  id: string;
  name: string;
  type: string;
  producer: string;
  country: string;
  abv: string;
  size: string;
  productUrl: string;
  imageUrl: string | null;
  packaging: AlkoProductPackaging;
}
