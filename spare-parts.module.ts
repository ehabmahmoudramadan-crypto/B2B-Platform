import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SparePartsService } from './spare-parts.service';
import { SparePartsController } from './spare-parts.controller';
import { SparePart } from './spare-part.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SparePart])],
  controllers: [SparePartsController],
  providers: [SparePartsService],
})
export class SparePartsModule {}
