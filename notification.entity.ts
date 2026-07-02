import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../common/base.entity';
import { User } from '../users/user.entity';
import { NotificationType } from '../common/enums';

@Entity('notifications')
export class Notification extends BaseEntity {
  @ManyToOne(() => User, (user) => user.notifications)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ type: 'enum', enum: NotificationType, default: NotificationType.IN_APP })
  type: NotificationType;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text' })
  body: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ nullable: true })
  actionUrl: string;

  @Column({ type: 'json', nullable: true })
  data: Record<string, any>;

  @Column({ default: false })
  isRead: boolean;

  @Column({ type: 'timestamp', nullable: true })
  readAt: Date;

  @Column({ nullable: true })
  externalId: string;

  @Column({ nullable: true })
  channel: string;

  @Column({ default: false })
  isSent: boolean;

  @Column({ type: 'timestamp', nullable: true })
  sentAt: Date;
}
