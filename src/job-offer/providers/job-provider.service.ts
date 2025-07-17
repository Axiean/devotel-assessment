import { Injectable, Logger } from '@nestjs/common';
import { JobProvider } from './job-provider.interface';
import { UnifiedJobOffer } from '../types/unified-job-offer.interface';
import { Provider1Strategy } from './provider1.strategy';
import { Provider2Strategy } from './provider2.strategy';

@Injectable()
export class JobProviderService {
  private readonly logger = new Logger(JobProviderService.name);

  constructor(
    private readonly provider1: Provider1Strategy,
    private readonly provider2: Provider2Strategy,
  ) {}

  async fetchAll(): Promise<UnifiedJobOffer[]> {
    const providers: JobProvider[] = [this.provider1, this.provider2];

    const allJobs: UnifiedJobOffer[] = [];

    for (const provider of providers) {
      try {
        const jobs = await provider.fetchJobs();
        allJobs.push(...jobs);
      } catch (error) {
        this.logger.error(
          `Error fetching jobs from provider: ${provider.constructor.name}`,
          error,
        );
      }
    }

    return allJobs;
  }
}
