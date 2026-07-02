import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DeliveryService } from './delivery.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';

@ApiTags('Delivery')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('delivery')
export class DeliveryController {
  constructor(private deliveryService: DeliveryService) {}

  @Get('available')
  @Roles('delivery')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get available deliveries' })
  async getAvailable() {
    return this.deliveryService.getAvailableDeliveries();
  }

  @Post('accept/:orderId')
  @Roles('delivery')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Accept a delivery' })
  async accept(@CurrentUser() user: any, @Param('orderId') orderId: string) {
    return this.deliveryService.acceptDelivery(user.id, orderId);
  }

  @Post('location')
  @Roles('delivery')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Update delivery location' })
  async updateLocation(
    @CurrentUser() user: any,
    @Body() body: { latitude: number; longitude: number },
  ) {
    return this.deliveryService.updateLocation(user.id, body.latitude, body.longitude);
  }

  @Post('status/:orderId')
  @Roles('delivery')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Update delivery status (picked_up/delivered)' })
  async updateStatus(
    @CurrentUser() user: any,
    @Param('orderId') orderId: string,
    @Body() body: { status: string; proofImageUrl?: string; signatureUrl?: string; notes?: string },
  ) {
    return this.deliveryService.updateDeliveryStatus(user.id, orderId, body.status, body);
  }

  @Get('history')
  @Roles('delivery')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get delivery history' })
  async getHistory(@CurrentUser() user: any) {
    return this.deliveryService.getDeliveryHistory(user.id);
  }
}
