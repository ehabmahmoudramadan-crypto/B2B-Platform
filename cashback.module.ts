import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CashbackService } from './cashback.service';
import { CashbackController } from './cashback.controller';
import { CashbackRule } from './cashback-rule.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CashbackRule])],
  controllers: [CashbackController],
  providers: [CashbackService],
  exports: [CashbackService],
})
export class CashbackModule {}
