import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Commission } from './commission.entity';

@Injectable()
export class CommissionsService {
  constructor(
    @InjectRepository(Commission)
    private commissionRepository: Repository<Commission>,
  ) {}

  async getCommissionRate(supplierId?: string): Promise<number> {
    const commission = await this.commissionRepository.findOne({
      where: supplierId ? { supplierId, isActive: true } : { isActive: true, supplierId: null },
    });

    return commission?.rate || 0;
  }

  async calculateCommission(amount: number, supplierId?: string): Promise<number> {
    const rate = await this.getCommissionRate(supplierId);
    return (amount * rate) / 100;
  }

  async createCommission(dto: { name: string; rate: number; type: string; supplierId?: string }) {
    const commission = this.commissionRepository.create(dto);
    return this.commissionRepository.save(commission);
  }
}
