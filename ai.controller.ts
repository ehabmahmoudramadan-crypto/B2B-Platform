import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AiService } from './ai.service';

@ApiTags('AI')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('ai')
export class AiController {
  constructor(private aiService: AiService) {}

  @Get('suppliers/:orderId')
  @ApiOperation({ summary: 'Suggest best suppliers for an order' })
  async suggestSuppliers(@Param('orderId') orderId: string) {
    return this.aiService.suggestBestSupplier(orderId);
  }

  @Get('price-analysis/:sparePartId')
  @ApiOperation({ summary: 'Analyze prices for a spare part' })
  async analyzePrices(@Param('sparePartId') sparePartId: string) {
    return this.aiService.analyzePrices(sparePartId);
  }

  @Get('alternatives/:sparePartId')
  @ApiOperation({ summary: 'Suggest alternative spare parts' })
  async suggestAlternatives(@Param('sparePartId') sparePartId: string) {
    return this.aiService.suggestAlternatives(sparePartId);
  }

  @Get('delivery-prediction/:orderId')
  @ApiOperation({ summary: 'Predict delivery time for an order' })
  async predictDelivery(@Param('orderId') orderId: string) {
    return this.aiService.predictDeliveryTime(orderId);
  }
}
