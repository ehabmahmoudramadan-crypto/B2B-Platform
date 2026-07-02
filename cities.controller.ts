import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CitiesService } from './cities.service';

@ApiTags('Cities')
@Controller('cities')
export class CitiesController {
  constructor(private citiesService: CitiesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all cities' })
  async findAll() {
    return this.citiesService.findAll();
  }
}
