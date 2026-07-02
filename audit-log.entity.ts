import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../common/base.entity';

@Entity('audit_logs')
export class AuditLog extends BaseEntity {
  @Column()
  userId: string;

  @Column({ nullable: true })
  userEmail: string;

  @Column()
  action: string;

  @Column()
  entity: string;

  @Column({ nullable: true })
  entityId: string;

  @Column({ type: 'json', nullable: true })
  oldValues: Record<string, any>;

  @Column({ type: 'json', nullable: true })
  newValues: Record<string, any>;

  @Column({ nullable: true })
  ipAddress: string;

  @Column({ nullable: true })
  userAgent: string;
}
