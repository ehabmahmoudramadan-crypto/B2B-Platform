import { Controller, Get, Query, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MapsService } from './maps.service';

@ApiTags('Maps')
@Controller('maps')
export class MapsController {
  constructor(private mapsService: MapsService) {}

  @Get('suppliers')
  @ApiOperation({ summary: 'Get supplier locations on map' })
  async getSuppliers(@Query('cityId') cityId?: string) {
    return this.mapsService.getSuppliersOnMap(cityId);
  }

  @Get('delivery')
  @ApiOperation({ summary: 'Get delivery person locations' })
  async getDeliveryLocations() {
    return this.mapsService.getDeliveryLocations();
  }

  @Get('distance')
  @ApiOperation({ summary: 'Calculate distance between two points' })
  async calculateDistance(
    @Query('lat1') lat1: number,
    @Query('lon1') lon1: number,
    @Query('lat2') lat2: number,
    @Query('lon2') lon2: number,
  ) {
    const distance = this.mapsService.calculateDistance(lat1, lon1, lat2, lon2);
    return {
      distanceKm: Math.round(distance * 100) / 100,
      deliveryFee: this.mapsService.estimateDeliveryFee(distance),
      estimatedMinutes: this.mapsService.estimateArrivalTime(distance),
    };
  }
}
