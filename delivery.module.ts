import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryService } from './delivery.service';
import { DeliveryController } from './delivery.controller';
import { DeliveryAssignment } from './delivery-assignment.entity';
import { DeliveryProfile } from './delivery-profile.entity';
import { Order } from '../orders/order.entity';
import { WalletModule } from '../wallet/wallet.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([DeliveryAssignment, DeliveryProfile, Order]),
    WalletModule,
    NotificationsModule,
    UsersModule,
  ],
  controllers: [DeliveryController],
  providers: [DeliveryService],
  exports: [DeliveryService],
})
export class DeliveryModule {}
