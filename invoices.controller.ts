import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { InvoicesService } from './invoices.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Invoices')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('invoices')
export class InvoicesController {
  constructor(private invoicesService: InvoicesService) {}

  @Post('generate/:orderId')
  @ApiOperation({ summary: 'Generate invoice for an order' })
  async generateInvoice(@Param('orderId') orderId: string) {
    return this.invoicesService.generateInvoice(orderId);
  }

  @Post(':id/issue')
  @ApiOperation({ summary: 'Issue invoice (submit to ZATCA)' })
  async issueInvoice(@Param('id') id: string) {
    return this.invoicesService.issueInvoice(id);
  }

  @Get()
  @ApiOperation({ summary: 'Get my invoices' })
  async getMyInvoices(@CurrentUser() user: any) {
    return this.invoicesService.getInvoicesForUser(user.id, user.role);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get invoice by ID' })
  async getInvoice(@Param('id') id: string) {
    return this.invoicesService.getInvoice(id);
  }
}
