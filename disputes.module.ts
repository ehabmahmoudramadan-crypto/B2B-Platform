import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DisputesService } from './disputes.service';
import { DisputesController } from './disputes.controller';
import { Dispute } from './dispute.entity';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [TypeOrmModule.forFeature([Dispute]), NotificationsModule],
  controllers: [DisputesController],
  providers: [DisputesService],
})
export class DisputesModule {}
