import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SupplierService } from './supplier.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';

@ApiTags('Supplier')
@Controller('supplier')
export class SupplierController {
  constructor(private supplierService: SupplierService) {}

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get supplier profile' })
  async getProfile(@CurrentUser() user: any) {
    return this.supplierService.getProfile(user.id);
  }

  @Put('profile')
  @Roles('supplier')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update supplier profile' })
  async updateProfile(
    @CurrentUser() user: any,
    @Body() dto: any,
  ) {
    return this.supplierService.updateProfile(user.id, dto);
  }

  @Get('all')
  @ApiOperation({ summary: 'Get all suppliers' })
  async getAllSuppliers() {
    return this.supplierService.getAllSuppliers();
  }
}
