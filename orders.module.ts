import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { Order } from './order.entity';
import { Offer } from './offer.entity';
import { WalletModule } from '../wallet/wallet.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { InvoicesModule } from '../invoices/invoices.module';
import { CashbackModule } from '../cashback/cashback.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, Offer]),
    WalletModule,
    NotificationsModule,
    InvoicesModule,
    CashbackModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
