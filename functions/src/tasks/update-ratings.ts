import { DatabaseClient } from '../clients/database';
import { UntappdClient } from '../clients/untappd';
import { ScheduledTask } from '.';
import { DatabaseEntry } from '../clients/database/types';

export interface UpdateRatingsTaskResult {
  updated: number;
}

export class UpdateRatingsTask extends ScheduledTask<UpdateRatingsTaskResult> {
  private static readonly BATCH_SIZE = 10;

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
          untappdRating: untappdGetBeerInfoResponse.response.beer.rating_score,
          untappdBeerSlug: untappdGetBeerInfoResponse.response.beer.beer_slug
        });
      } else {
        updatedEntries.push({
          ...entry,
          untappdRating: null,
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
    if (first.untappdRating != null && second.untappdRating != null) {
      return first.createdAt.getTime() - second.createdAt.getTime();
    }
    if (first.untappdRating == null && second.untappdRating == null) {
      return first.createdAt.getTime() - second.createdAt.getTime();
    }
    return first.untappdRating != null ? 1 : -1;
  }
}
