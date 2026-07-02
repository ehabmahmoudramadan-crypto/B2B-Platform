import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dispute } from './dispute.entity';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class DisputesService {
  constructor(
    @InjectRepository(Dispute)
    private disputeRepository: Repository<Dispute>,
    private notificationsService: NotificationsService,
  ) {}

  async create(dto: { orderId: string; raisedById: string; subject: string; description: string; attachments?: string[] }) {
    const dispute = this.disputeRepository.create(dto);
    await this.disputeRepository.save(dispute);

    await this.notificationsService.sendToRole(
      'admin',
      'نزاع جديد',
      `تم فتح نزاع جديد: ${dto.subject}`,
      { disputeId: dispute.id, type: 'new_dispute' },
    );

    return dispute;
  }

  async findByUser(userId: string) {
    return this.disputeRepository.find({
      where: { raisedById: userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const dispute = await this.disputeRepository.findOne({ where: { id } });
    if (!dispute) throw new NotFoundException('Dispute not found');
    return dispute;
  }
}
