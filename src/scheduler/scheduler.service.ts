import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { cronSchedules } from 'src/config/cron.config';
import { JobOfferService } from 'src/job-offer/job-offer.service';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(private readonly jobOffersService: JobOfferService) {}

  @Cron(cronSchedules.syncJobOffers)
  async handleJobOfferSync(): Promise<void> {
    this.logger.log('Scheduled job started: Sync job offers');

    try {
      await this.syncAllJobOffers();
      this.logger.log('Job offers synced successfully');
    } catch (error) {
      this.logger.error('Failed to sync job offers', error);
    }
  }

  private async syncAllJobOffers(): Promise<void> {
    await this.jobOffersService.syncAll();
  }
}
