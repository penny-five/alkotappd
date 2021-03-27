import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';

import { ProductService } from './product.service';

@Controller()
export class ProductController {
  private productService: ProductService;

  constructor(productService: ProductService) {
    this.productService = productService;
  }

  @Get('public/stores/:storeId/products')
  async getStoreProducts(@Param('storeId', ParseIntPipe) storeId: number) {
    const products = await this.productService.getAllStoreProducts(storeId);

    return products;
  }
}
