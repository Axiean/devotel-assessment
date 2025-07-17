import { CronExpression } from '@nestjs/schedule';

export const cronSchedules = {
  syncJobOffers: CronExpression.EVERY_HOUR,
};
