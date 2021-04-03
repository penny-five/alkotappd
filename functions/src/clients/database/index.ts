import { Firestore, Timestamp } from '@google-cloud/firestore';
import { Injectable } from '@nestjs/common';
import admin from 'firebase-admin';
import mem from 'mem';

import {
  DatabaseEntry,
  SyncDatabaseCommand,
  SyncDatabaseResult,
  UpdateDatabaseCommand
} from './types';

@Injectable()
export class DatabaseClient {
  private db: Firestore;

  constructor() {
    this.db = admin.firestore();
  }

  async getAll(params?: { useCache: boolean }) {
    if (params?.useCache) {
      return this.cachedGetAll();
    }

    const collectionRef = this.db.collection('entries');

    const snapshot = await collectionRef.get();

    const entries = snapshot.docs.map<DatabaseEntry>(doc => ({
      id: doc.id,
      createdAt: (doc.get('createdAt') as Timestamp).toDate(),
      updatedAt: (doc.get('updatedAt') as Timestamp).toDate(),
      name: doc.get('name'),
      untappdBeerId: doc.get('untappdBeerId'),
      untappdRatingScore: doc.get('untappdRatingScore'),
      untappdRatingCount: doc.get('untappdRatingCount'),
      untappdBeerSlug: doc.get('untappdBeerSlug')
    }));

    return entries;
  }

  @mem.decorator({ maxAge: 1000 * 60 * 60 })
  private async cachedGetAll(): Promise<DatabaseEntry[]> {
    return this.getAll({ useCache: false });
  }

  async sync(command: SyncDatabaseCommand) {
    const result: SyncDatabaseResult = {
      created: 0,
      updated: 0,
      deleted: 0
    };

    const currentEntries = await this.getAll();
    const deletableEntries = [...currentEntries];

    await this.db.runTransaction(async () => {
      const collectionRef = this.db.collection('entries');

      for (const entry of command.entries) {
        const currentIndex = currentEntries.findIndex(({ id }) => id === entry.id);

        if (currentIndex >= 0) {
          await collectionRef.doc(entry.id).set(entry, { merge: true });

          deletableEntries.splice(
            deletableEntries.findIndex(({ id }) => id === entry.id),
            1
          );

          result.updated += 1;
        } else {
          await collectionRef.doc(entry.id).set({
            ...entry,
            createdAt: new Date(),
            updatedAt: new Date(),
            untappdRatingScore: null,
            untappdRatingCount: null,
            untappdBeerSlug: null
          });

          result.created += 1;
        }
      }

      for (const entry of deletableEntries) {
        await collectionRef.doc(entry.id).delete();

        result.deleted += 1;
      }
    });

    return result;
  }

  async update(command: UpdateDatabaseCommand) {
    await this.db.runTransaction(async () => {
      const collectionRef = this.db.collection('entries');

      for (const entry of command.entries) {
        await collectionRef.doc(entry.id!).set(
          {
            ...entry,
            updatedAt: new Date()
          },
          { merge: true }
        );
      }
    });
  }
}
