import { DatabaseClient } from '../clients/database';
import { UntappdClient } from '../clients/untappd';
import { ScheduledTask } from '.';
import { DatabaseEntry } from '../clients/database/types';

export interface UpdateRatingsTaskResult {
  updated: number;
}

export class UpdateRatingsTask extends ScheduledTask<UpdateRatingsTaskResult> {
  /**
   * Untappd API has rate limit of 100 requests per hour. To process one item,
   * 2 separate requests are need. With batch size of 30 rate limiting should
   * be avoided if the task is executed at max once per hour.
   */
  private static readonly BATCH_SIZE = 30;

  private databaseClient: DatabaseClient;

  private untappdClient: UntappdClient;

  constructor(untappdClient: UntappdClient, databaseClient: DatabaseClient) {
    super();
    this.untappdClient = untappdClient;
    this.databaseClient = databaseClient;
  }

  async onExecute() {
    const entries = await this.databaseClient.getAll();

    const sortedEntries = [...entries].sort(this.compareEntriesByUpdatePriority);

    const updatedEntries: DatabaseEntry[] = [];

    for (const entry of sortedEntries.slice(0, UpdateRatingsTask.BATCH_SIZE)) {
      const untappdSearchBeerResponse = await this.untappdClient.searchBeer(entry.name);
      const untappdBeer = untappdSearchBeerResponse.response.beers.items[0]?.beer;

      if (untappdBeer != null) {
        const untappdGetBeerInfoResponse = await this.untappdClient.getBeerInfo(untappdBeer.bid);

        updatedEntries.push({
          ...entry,
          untappdBeerId: untappdGetBeerInfoResponse.response.beer.bid,
          untappdRatingScore: untappdGetBeerInfoResponse.response.beer.rating_score,
          untappdRatingCount: untappdGetBeerInfoResponse.response.beer.rating_count,
          untappdBeerSlug: untappdGetBeerInfoResponse.response.beer.beer_slug
        });
      } else {
        updatedEntries.push({
          ...entry,
          untappdBeerId: null,
          untappdRatingScore: null,
          untappdRatingCount: null,
          untappdBeerSlug: null
        });
      }
    }

    await this.databaseClient.update({
      entries: updatedEntries
    });

    return {
      updated: updatedEntries.length
    };
  }

  private compareEntriesByUpdatePriority(first: DatabaseEntry, second: DatabaseEntry) {
    return first.updatedAt.getTime() - second.updatedAt.getTime();
  }
}
