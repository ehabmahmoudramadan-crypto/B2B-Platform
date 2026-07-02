import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './audit-log.entity';

@Injectable()
export class AuditLogService {
  constructor(
    @InjectRepository(AuditLog)
    private auditLogRepository: Repository<AuditLog>,
  ) {}

  async log(data: {
    userId: string;
    userEmail?: string;
    action: string;
    entity: string;
    entityId?: string;
    oldValues?: Record<string, any>;
    newValues?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
  }) {
    const log = this.auditLogRepository.create(data);
    await this.auditLogRepository.save(log);
    return log;
  }
}
