import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { User } from '../users/user.entity';
import { Order } from '../orders/order.entity';
import { Wallet } from '../wallet/wallet.entity';
import { Invoice } from '../invoices/invoice.entity';
import { Dispute } from '../disputes/dispute.entity';
import { Category } from '../categories/category.entity';
import { Brand } from '../brands/brand.entity';
import { SparePart } from '../spare-parts/spare-part.entity';
import { City } from '../cities/city.entity';
import { SupplierProfile } from '../supplier/supplier-profile.entity';
import { DeliveryProfile } from '../delivery/delivery-profile.entity';
import { Notification } from '../notifications/notification.entity';
import { AuditLog } from '../audit-log/audit-log.entity';
import { UsersModule } from '../users/users.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User, Order, Wallet, Invoice, Dispute,
      Category, Brand, SparePart, City,
      SupplierProfile, DeliveryProfile,
      Notification, AuditLog,
    ]),
    UsersModule,
    NotificationsModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
