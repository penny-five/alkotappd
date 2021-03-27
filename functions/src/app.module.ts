import { Module } from '@nestjs/common';
import { Config } from './config';

import { CommonModule } from './modules/common/common.module';
import { ProductModule } from './modules/product/product.module';
import { StoreModule } from './modules/store/store.module';

@Module({
  imports: [CommonModule, ProductModule, StoreModule],
  providers: [Config],
  exports: [Config]
})
export class AppModule {}
