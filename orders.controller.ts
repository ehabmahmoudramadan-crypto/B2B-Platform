import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto, SubmitOfferDto, AcceptOfferDto } from './orders.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';

@ApiTags('Orders')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  @Roles('client')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Create a new order' })
  async create(@CurrentUser() user: any, @Body() dto: CreateOrderDto) {
    return this.ordersService.create(user.id, dto);
  }

  @Get('my-orders')
  @Roles('client')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get my orders (client)' })
  async getMyOrders(@CurrentUser() user: any) {
    return this.ordersService.findAllForClient(user.id);
  }

  @Get('available')
  @Roles('supplier')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get available orders for suppliers' })
  async getAvailableOrders() {
    return this.ordersService.getAvailableOrders();
  }

  @Get('supplier-orders')
  @Roles('supplier')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get supplier orders' })
  async getSupplierOrders(@CurrentUser() user: any) {
    return this.ordersService.getOrdersForSupplier(user.id);
  }

  @Get('delivery-orders')
  @Roles('delivery')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get available delivery orders' })
  async getDeliveryOrders() {
    return this.ordersService.getOrdersForDelivery();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order by ID' })
  async findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Post(':id/offer')
  @Roles('supplier')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Submit an offer for an order' })
  async submitOffer(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() dto: SubmitOfferDto,
  ) {
    return this.ordersService.submitOffer(user.id, id, dto);
  }

  @Post(':id/accept-offer')
  @Roles('client')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Accept an offer' })
  async acceptOffer(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() dto: AcceptOfferDto,
  ) {
    return this.ordersService.acceptOffer(user.id, id, dto);
  }

  @Post(':id/confirm-parts')
  @Roles('supplier')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Confirm parts availability' })
  async confirmParts(@CurrentUser() user: any, @Param('id') id: string) {
    return this.ordersService.confirmPartsAvailable(user.id, id);
  }
}
