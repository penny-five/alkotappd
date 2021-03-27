import { Injectable } from '@nestjs/common';
import * as functions from 'firebase-functions';

@Injectable()
export class Config {
  private untappdClientId: string;
  private untappdClientSecret: string;

  constructor() {
    this.untappdClientId = functions.config().untappd.client_id;
    this.untappdClientSecret = functions.config().untappd.client_secret;
  }

  getUntappdClientId() {
    return this.untappdClientId;
  }

  getUntappdClientSecret() {
    return this.untappdClientSecret;
  }
}
