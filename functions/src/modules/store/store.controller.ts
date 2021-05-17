import { Controller, Get, Param, Query } from '@nestjs/common';

import { IsRequiredPipe } from '../../pipes/is-required';
import { StoreService } from './store.service';

@Controller()
export class StoreController {
  private storeService: StoreService;

  constructor(storeService: StoreService) {
    this.storeService = storeService;
  }

  @Get('stores/:id')
  async getStore(@Param('id') id: string) {
    const store = await this.storeService.getStore(id);
    return store;
  }

  @Get('stores')
  async getAllStores(@Query('search', new IsRequiredPipe()) searchphrase: string) {
    const stores = await this.storeService.searchStores(searchphrase);

    return stores;
  }
}
