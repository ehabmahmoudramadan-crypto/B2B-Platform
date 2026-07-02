import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';

@ApiTags('Reports')
@ApiBearerAuth()
@Roles('admin', 'client', 'supplier')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get('financial')
  @ApiOperation({ summary: 'Get financial report' })
  async getFinancial(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.reportsService.getFinancialReport(startDate, endDate);
  }

  @Get('sales')
  @ApiOperation({ summary: 'Get sales report' })
  async getSales(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.reportsService.getSalesReport(startDate, endDate);
  }

  @Get('suppliers')
  @ApiOperation({ summary: 'Get supplier report' })
  async getSuppliers(@Query('supplierId') supplierId?: string) {
    return this.reportsService.getSupplierReport(supplierId);
  }

  @Get('clients')
  @ApiOperation({ summary: 'Get client report' })
  async getClients(@Query('clientId') clientId?: string) {
    return this.reportsService.getClientReport(clientId);
  }

  @Get('wallet')
  @ApiOperation({ summary: 'Get wallet report' })
  async getWallet() {
    return this.reportsService.getWalletReport();
  }

  @Get('performance')
  @ApiOperation({ summary: 'Get performance report' })
  async getPerformance() {
    return this.reportsService.getPerformanceReport();
  }
}
