import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { BrandsService } from './brands.service';

@ApiTags('Brands')
@Controller('brands')
export class BrandsController {
  constructor(private brandsService: BrandsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all brands' })
  async findAll() {
    return this.brandsService.findAll();
  }
}
