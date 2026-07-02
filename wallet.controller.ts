import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { WalletService } from './wallet.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { DepositDto, WithdrawDto } from './wallet.dto';

@ApiTags('Wallet')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('wallet')
export class WalletController {
  constructor(private walletService: WalletService) {}

  @Get()
  @ApiOperation({ summary: 'Get wallet balance and details' })
  async getWallet(@CurrentUser() user: any) {
    return this.walletService.getWallet(user.id);
  }

  @Get('transactions')
  @ApiOperation({ summary: 'Get wallet transactions' })
  async getTransactions(
    @CurrentUser() user: any,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.walletService.getTransactions(user.id, page, limit);
  }

  @Post('deposit')
  @ApiOperation({ summary: 'Deposit money to wallet' })
  async deposit(@CurrentUser() user: any, @Body() dto: DepositDto) {
    return this.walletService.deposit(user.id, dto.amount, dto.paymentReference);
  }

  @Post('withdraw')
  @ApiOperation({ summary: 'Withdraw money from wallet' })
  async withdraw(@CurrentUser() user: any, @Body() dto: WithdrawDto) {
    return this.walletService.withdraw(user.id, dto.amount);
  }
}
