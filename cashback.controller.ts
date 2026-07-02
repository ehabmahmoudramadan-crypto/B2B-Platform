import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CashbackService } from './cashback.service';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';

@ApiTags('Cashback')
@Controller('cashback')
export class CashbackController {
  constructor(private cashbackService: CashbackService) {}

  @Get('rules')
  @ApiOperation({ summary: 'Get cashback rules' })
  async getRules() {
    return this.cashbackService.getRules();
  }

  @Post('rules')
  @Roles('admin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create cashback rule (admin)' })
  async createRule(@Body() dto: { name: string; type: string; value: number; minOrderAmount?: number; maxCashback?: number }) {
    return this.cashbackService.createRule(dto);
  }
}
