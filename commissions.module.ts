import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommissionsService } from './commissions.service';
import { Commission } from './commission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Commission])],
  providers: [CommissionsService],
  exports: [CommissionsService],
})
export class CommissionsModule {}
