import { UnifiedJobOffer } from '../types';

export interface JobProvider {
  fetchJobs(): Promise<UnifiedJobOffer[]>;
}
