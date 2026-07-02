import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../orders/order.entity';
import { SupplierProfile } from '../supplier/supplier-profile.entity';
import { SparePart } from '../spare-parts/spare-part.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, SupplierProfile, SparePart])],
  controllers: [AiController],
  providers: [AiService],
  exports: [AiService],
})
export class AiModule {}
