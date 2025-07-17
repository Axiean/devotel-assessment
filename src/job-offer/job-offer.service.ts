import { Injectable } from '@nestjs/common';
import { JobOffer } from './entities/job-offer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobProviderService } from './providers/job-provider.service';

@Injectable()
export class JobOfferService {
  constructor(
    @InjectRepository(JobOffer)
    private readonly repo: Repository<JobOffer>,
    private readonly jobProviderService: JobProviderService,
  ) {}

  async syncAll() {
    const offers = await this.jobProviderService.fetchAll();

    for (const offer of offers) {
      const exists = await this.repo.findOneBy({
        externalId: offer.externalId,
      });
      if (!exists) {
        await this.repo.save(offer);
      }
    }
  }
}
