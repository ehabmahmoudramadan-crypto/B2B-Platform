import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../common/base.entity';
import { User } from '../users/user.entity';

@Entity('reviews')
export class Review extends BaseEntity {
  @ManyToOne(() => User, (user) => user.reviews)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: string;

  @Column()
  targetId: string;

  @Column({ length: 50 })
  targetType: string;

  @Column({ type: 'int', minimum: 1, maximum: 5 })
  rating: number;

  @Column({ type: 'text', nullable: true })
  comment: string;

  @Column({ nullable: true })
  orderId: string;
}
