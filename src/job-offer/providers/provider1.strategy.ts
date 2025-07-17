import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { JobProvider } from './job-provider.interface';
import { UnifiedJobOffer } from '../types/unified-job-offer.interface';

@Injectable()
export class Provider1Strategy implements JobProvider {
  async fetchJobs(): Promise<UnifiedJobOffer[]> {
    const { data } = await axios.get(
      'https://assignment.devotel.io/api/provider1/jobs',
    );

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
