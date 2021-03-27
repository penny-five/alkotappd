export interface DatabaseEntry {
  id: string;
  updatedAt: Date;
  createdAt: Date;
  name: string;
  untappdRating: number | null;
  untappdBeerSlug: string | null;
}

export interface SyncDatabaseCommand {
  entries: {
    id: string;
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
