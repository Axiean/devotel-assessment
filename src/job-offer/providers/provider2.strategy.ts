import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { JobProvider } from './job-provider.interface';
import { UnifiedJobOffer } from '../types/unified-job-offer.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class Provider2Strategy implements JobProvider {
  constructor(private readonly configService: ConfigService) {}

  /**
   * Fetches jobs from Provider 2 and transforms them into the unified format.
   * This provider's API returns jobs as a nested object, so we convert it to an array.
   *
   * @returns A promise that resolves to an array of unified job offers from Provider 2.
   */
  async fetchJobs(): Promise<UnifiedJobOffer[]> {
    const apiUrl = this.configService.get<string>('PROVIDER2_API_URL')!;
    const { data } = await axios.get(apiUrl);

    // Provider 2 returns jobs as a key-value pair object.
    // We use Object.entries to convert this into an array for easier mapping.
    const jobEntries = Object.entries(data.data.jobsList);

    return jobEntries.map(([jobId, job]: [string, any]) => ({
      title: job.position,
      company: job.employer.companyName,
      location: `${job.location.city}, ${job.location.state}`,
      salaryMin: job.compensation.min,
      salaryMax: job.compensation.max,
      currency: job.compensation.currency,
      postedDate: new Date(job.datePosted),
      skills: job.requirements.technologies || [],
      externalId: `provider2-${jobId}`,
      source: 'provider2',
    }));
  }
}
