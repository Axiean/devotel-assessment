import { Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { ScheduleModule } from '@nestjs/schedule';
import { JobOfferModule } from 'src/job-offer/job-offer.module';

@Module({
  imports: [ScheduleModule.forRoot(), JobOfferModule],
  providers: [SchedulerService],
})
export class SchedulerModule {}
