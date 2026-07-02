import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { Order } from '../orders/order.entity';
import { User } from '../users/user.entity';
import { Invoice } from '../invoices/invoice.entity';
import { WalletTransaction } from '../wallet/wallet-transaction.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, User, Invoice, WalletTransaction]),
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
