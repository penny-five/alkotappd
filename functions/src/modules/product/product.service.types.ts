import { AlkoProduct } from '../../clients/alko/types';

export interface Product extends AlkoProduct {
  untappdBeerId: number | null;
  untappdRatingScore: number | null;
  untappdRatingCount: number | null;
  untappdBeerSlug: string | null;
}
