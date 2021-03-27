import { AlkoProduct } from '../../clients/alko/types';

export interface Product extends AlkoProduct {
  untappdRating: number | null;
  untappdBeerSlug: string | null;
}
