import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './notification.entity';
import { User } from '../users/user.entity';

@Processor('notifications')
export class NotificationProcessor {
  private readonly logger = new Logger(NotificationProcessor.name);

  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  @Process('send')
  async handleSend(job: Job) {
    const { notificationId, userId, title, body, data, type } = job.data;
    this.logger.log(`Sending notification ${notificationId} to user ${userId}`);

    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) return;

      if (type === 'push' || type === 'in_app') {
        // TODO: Integrate Firebase Cloud Messaging
        // const deviceTokens = user.deviceTokens;
        // if (deviceTokens?.length) {
        //   await admin.messaging().sendEachForMulticast({
        //     tokens: deviceTokens,
        //     notification: { title, body },
        //     data: data as any,
        //   });
        // }
      }

      if (type === 'email') {
        // TODO: Integrate email sending via nodemailer
      }

      if (type === 'sms') {
        // TODO: Integrate SMS via Twilio
      }

      await this.notificationRepository.update(notificationId, {
        isSent: true,
        sentAt: new Date(),
      });

      this.logger.log(`Notification ${notificationId} sent successfully`);
    } catch (error) {
      this.logger.error(`Failed to send notification ${notificationId}`, error);
    }
  }

  @Process('broadcast')
  async handleBroadcast(job: Job) {
    const { role, title, body, data } = job.data;
    this.logger.log(`Broadcasting notification to all ${role} users`);

    const users = await this.userRepository.find({ where: { role: role as any } });

    for (const user of users) {
      const notification = this.notificationRepository.create({
        userId: user.id,
        title,
        body,
        data,
        type: 'in_app',
      });
      await this.notificationRepository.save(notification);
    }
  }
}
