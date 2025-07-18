import { ConfigService } from '@nestjs/config';
import { CronExpression } from '@nestjs/schedule';

const configService = new ConfigService();

export const cronSchedules = {
  syncJobOffers: configService.get<string>(
    'SYNC_JOB_OFFERS_CRON_SCHEDULE',
    CronExpression.EVERY_HOUR,
  ),
};
