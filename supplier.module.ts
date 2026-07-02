import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupplierController } from './supplier.controller';
import { SupplierService } from './supplier.service';
import { SupplierProfile } from './supplier-profile.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SupplierProfile]),
    UsersModule,
  ],
  controllers: [SupplierController],
  providers: [SupplierService],
  exports: [SupplierService],
})
export class SupplierModule {}
