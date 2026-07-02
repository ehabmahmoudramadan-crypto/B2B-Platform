import { Injectable } from '@nestjs/common';
import { BullRootModuleOptions, SharedBullConfigurationFactory } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisConfig implements SharedBullConfigurationFactory {
  constructor(private configService: ConfigService) {}

  createSharedConfiguration(): BullRootModuleOptions {
    return {
      redis: {
        host: this.configService.get('REDIS_HOST', 'localhost'),
        port: this.configService.get('REDIS_PORT', 6379),
      },
    };
  }
}
