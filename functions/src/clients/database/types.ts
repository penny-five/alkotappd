export interface DatabaseEntry {
  id: string;
  updatedAt: Date;
  createdAt: Date;
  name: string;
  untappdBeerId: number | null;
  untappdRatingScore: number | null;
  untappdRatingCount: number | null;
  untappdBeerSlug: string | null;
}

export interface SyncDatabaseCommand {
  entries: {
    id: string;
    name: string;
  }[];
}

export interface SyncDatabaseResult {
  created: number;
  updated: number;
  deleted: number;
}

export interface UpdateDatabaseCommand {
  entries: Partial<DatabaseEntry>[];
}
