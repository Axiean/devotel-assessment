import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { JobProvider } from './job-provider.interface';
import { UnifiedJobOffer } from '../types/unified-job-offer.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class Provider1Strategy implements JobProvider {
  constructor(private readonly configService: ConfigService) {}

  async fetchJobs(): Promise<UnifiedJobOffer[]> {
    const apiUrl = this.configService.get<string>('PROVIDER1_API_URL')!;
    const { data } = await axios.get(apiUrl);

    return data.jobs.map((job: any) => {
      const salaryMatch = job.details.salaryRange?.match(
        /\$?(\d+)k\s*-\s*\$?(\d+)k/i,
      );
      const salaryMin = salaryMatch ? parseInt(salaryMatch[1]) * 1000 : null;
      const salaryMax = salaryMatch ? parseInt(salaryMatch[2]) * 1000 : null;

      return {
        title: job.title,
        company: job.company.name,
        location: job.details.location,
        salaryMin,
        salaryMax,
        currency: 'USD',
        postedDate: new Date(job.postedDate),
        skills: job.skills || [],
        externalId: `provider1-${job.jobId}`,
        source: 'provider1',
      };
    });
  }
}
