import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { JobProvider } from './job-provider.interface';
import { UnifiedJobOffer } from '../types/unified-job-offer.interface';

@Injectable()
export class Provider2Strategy implements JobProvider {
  async fetchJobs(): Promise<UnifiedJobOffer[]> {
    const { data } = await axios.get(
      'https://assignment.devotel.io/api/provider2/jobs',
    );

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
