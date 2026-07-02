import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../common/base.entity';
import { DisputeStatus } from '../common/enums';

@Entity('disputes')
export class Dispute extends BaseEntity {
  @Column()
  orderId: string;

  @Column()
  raisedById: string;

  @Column({ nullable: true })
  againstId: string;

  @Column({ length: 100 })
  subject: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'simple-json', nullable: true })
  attachments: string[];

  @Column({ type: 'enum', enum: DisputeStatus, default: DisputeStatus.OPEN })
  status: DisputeStatus;

  @Column({ nullable: true })
  assignedToId: string;

  @Column({ type: 'text', nullable: true })
  resolution: string;

  @Column({ type: 'timestamp', nullable: true })
  resolvedAt: Date;

  @Column({ type: 'json', nullable: true })
  messages: {
    senderId: string;
    message: string;
    createdAt: Date;
  }[];
}
