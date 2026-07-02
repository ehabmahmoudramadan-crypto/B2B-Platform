import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MapsController } from './maps.controller';
import { MapsService } from './maps.service';
import { SupplierProfile } from '../supplier/supplier-profile.entity';
import { DeliveryProfile } from '../delivery/delivery-profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SupplierProfile, DeliveryProfile])],
  controllers: [MapsController],
  providers: [MapsService],
  exports: [MapsService],
})
export class MapsModule {}
