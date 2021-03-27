import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import mem from 'mem';

import { AppModule } from './app.module';
import { Config } from './config';
import { AlkoClient } from './clients/alko';
import { DatabaseClient } from './clients/database';
import { UntappdClient } from './clients/untappd';
import { SyncProductsTask } from './tasks/sync-products';
import { UpdateRatingsTask } from './tasks/update-ratings';

admin.initializeApp();

const getServer = mem(async () => {
  const server = express();

  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  await app.init();

  return server;
});

export const api = functions
  .region('europe-west1')
  .runWith({
    maxInstances: 1,
    memory: '512MB',
    timeoutSeconds: 30
  })
  .https.onRequest(async (req, res) => {
    const server = await getServer();
    server(req, res);
  });

export const syncProducts = functions.pubsub
  .schedule('every day 01:00')
  .timeZone('Europe/Helsinki')
  .onRun(async () => {
    const task = new SyncProductsTask(new AlkoClient(), new DatabaseClient());
    const result = await task.execute();
    console.log(result);
  });

export const updateRatings = functions.pubsub
  .schedule('every 2 hours')
  .timeZone('Europe/Helsinki')
  .onRun(async () => {
    const task = new UpdateRatingsTask(new UntappdClient(new Config()), new DatabaseClient());
    const result = await task.execute();
    console.log(result);
  });
