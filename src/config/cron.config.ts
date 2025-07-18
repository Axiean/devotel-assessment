import { ConfigService } from '@nestjs/config';
import { CronExpression } from '@nestjs/schedule';

export const cronSchedules = {
  syncJobOffers:
    process.env.SYNC_JOB_OFFERS_CRON_SCHEDULE || CronExpression.EVERY_HOUR,
};
