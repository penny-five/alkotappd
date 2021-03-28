import { Controller, Get, Query } from '@nestjs/common';

import { IsRequiredPipe } from '../../pipes/is-required';
import { StoreService } from './store.service';

@Controller()
export class StoreController {
  private storeService: StoreService;

  constructor(storeService: StoreService) {
    this.storeService = storeService;
  }

  @Get('stores')
  async getAllStores(@Query('search', new IsRequiredPipe()) searchphrase: string) {
    const stores = await this.storeService.searchStores(searchphrase);

    return stores;
  }
}
