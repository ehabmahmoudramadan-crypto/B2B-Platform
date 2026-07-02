import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../orders/order.entity';
import { CashbackRule } from './cashback-rule.entity';

@Injectable()
export class CashbackService {
  constructor(
    @InjectRepository(CashbackRule)
    private cashbackRuleRepository: Repository<CashbackRule>,
  ) {}

  async calculateCashback(order: Order): Promise<number> {
    const rules = await this.cashbackRuleRepository.find({ where: { isActive: true } });

    let cashback = 0;
    for (const rule of rules) {
      if (rule.type === 'percentage') {
        cashback += (order.total * rule.value) / 100;
      } else if (rule.type === 'fixed') {
        cashback += rule.value;
      }
    }

    return Math.min(cashback, order.total * 0.1);
  }

  async createRule(dto: { name: string; type: string; value: number; minOrderAmount?: number; maxCashback?: number }) {
    const rule = this.cashbackRuleRepository.create(dto);
    return this.cashbackRuleRepository.save(rule);
  }

  async getRules() {
    return this.cashbackRuleRepository.find();
  }
}
