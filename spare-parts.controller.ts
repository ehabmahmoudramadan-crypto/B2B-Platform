import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SparePartsService } from './spare-parts.service';

@ApiTags('Spare Parts')
@Controller('spare-parts')
export class SparePartsController {
  constructor(private sparePartsService: SparePartsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all spare parts' })
  async findAll(
    @Query('categoryId') categoryId?: string,
    @Query('brandId') brandId?: string,
    @Query('search') search?: string,
  ) {
    return this.sparePartsService.findAll(categoryId, brandId, search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get spare part by ID' })
  async findOne(@Param('id') id: string) {
    return this.sparePartsService.findOne(id);
  }
}
