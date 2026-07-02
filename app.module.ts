import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bull';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { OrdersModule } from './orders/orders.module';
import { WalletModule } from './wallet/wallet.module';
import { InvoicesModule } from './invoices/invoices.module';
import { NotificationsModule } from './notifications/notifications.module';
import { MapsModule } from './maps/maps.module';
import { AiModule } from './ai/ai.module';
import { ReportsModule } from './reports/reports.module';
import { AdminModule } from './admin/admin.module';
import { DeliveryModule } from './delivery/delivery.module';
import { SupplierModule } from './supplier/supplier.module';
import { CategoriesModule } from './categories/categories.module';
import { BrandsModule } from './brands/brands.module';
import { SparePartsModule } from './spare-parts/spare-parts.module';
import { CitiesModule } from './cities/cities.module';
import { DisputesModule } from './disputes/disputes.module';
import { CashbackModule } from './cashback/cashback.module';
import { CommissionsModule } from './commissions/commissions.module';
import { AuditLogModule } from './audit-log/audit-log.module';
import { DatabaseConfig } from './config/database.config';
import { RedisConfig } from './config/redis.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfig,
    }),
    BullModule.forRootAsync({
      useClass: RedisConfig,
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 60 * 1000,
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 100,
        },
      ],
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    UsersModule,
    OrdersModule,
    WalletModule,
    InvoicesModule,
    NotificationsModule,
    MapsModule,
    AiModule,
    ReportsModule,
    AdminModule,
    DeliveryModule,
    SupplierModule,
    CategoriesModule,
    BrandsModule,
    SparePartsModule,
    CitiesModule,
    DisputesModule,
    CashbackModule,
    CommissionsModule,
    AuditLogModule,
  ],
})
export class AppModule {}
