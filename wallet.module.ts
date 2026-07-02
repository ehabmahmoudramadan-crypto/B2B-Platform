import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { Wallet } from './wallet.entity';
import { WalletTransaction } from './wallet-transaction.entity';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wallet, WalletTransaction]),
    NotificationsModule,
  ],
  controllers: [WalletController],
  providers: [WalletService],
  exports: [WalletService],
})
export class WalletModule {}
