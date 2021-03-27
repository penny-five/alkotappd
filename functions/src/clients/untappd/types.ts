interface UntappdResponseMeta {
  code: number;
  response_time: {
    time: number;
    measure: 'seconds';
  };
}
interface UntappdResponse<T> {
  meta: UntappdResponseMeta;
  response: T;
}

interface UntappdListResult {
  found: number;
  offset: number;
  limit: number;
}

interface UntappdBeerResult {
  bid: number;
  beer_name: string;
  beer_slug: string;
  beer_label: string;
  beer_abv: string;
  beer_ibu: number;
  beer_description: number;
}

interface UntappdSearchBeerResult extends UntappdListResult {
  beers: { count: number; items: { beer: UntappdBeerResult }[] };
}

interface UntappdGetBeerInfoResult {
  beer: UntappdBeerResult & {
    rating_count: number;
    rating_score: number | null;
  };
}
