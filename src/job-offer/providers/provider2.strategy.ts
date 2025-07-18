import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { JobProvider } from './job-provider.interface';
import { UnifiedJobOffer } from '../types/unified-job-offer.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class Provider2Strategy implements JobProvider {
  constructor(private readonly configService: ConfigService) {}

  async fetchJobs(): Promise<UnifiedJobOffer[]> {
    const apiUrl = this.configService.get<string>('PROVIDER2_API_URL')!;
    const { data } = await axios.get(apiUrl);

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
