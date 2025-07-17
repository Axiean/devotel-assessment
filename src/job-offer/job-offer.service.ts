import { Injectable } from '@nestjs/common';
import { JobOffer } from './entities/job-offer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { JobProviderService } from './providers/job-provider.service';
import { GetJobOffersDto } from './dto';

@Injectable()
export class JobOfferService {
  constructor(
    @InjectRepository(JobOffer)
    private readonly repo: Repository<JobOffer>,
    private readonly jobProviderService: JobProviderService,
  ) {}

  async getJobOffers(getJobOffersDto: GetJobOffersDto) {
    const {
      title,
      location,
      minSalary,
      maxSalary,
      page = 1,
      limit = 10,
    } = getJobOffersDto;

    const skip = (page - 1) * limit;

    const query: FindManyOptions<JobOffer> = {
      where: {},
      order: { postedDate: 'DESC' },
      skip,
      take: limit,
    };

    if (title) {
      (query.where as any)['title'] = title;
    }
    if (location) {
      (query.where as any)['location'] = location;
    }
    if (minSalary) {
      (query.where as any)['salaryMin'] = minSalary;
    }
    if (maxSalary) {
      (query.where as any)['salaryMax'] = maxSalary;
    }

    const [data, total] = await this.repo.findAndCount(query);

    return { data, total, page, limit };
  }

  async syncAll() {
    const offers = await this.jobProviderService.fetchAll();

    for (const offer of offers) {
      console.log(offer.externalId);

      const exists = await this.repo.findOneBy({
        externalId: offer.externalId,
      });
      if (!exists) {
        await this.repo.save(offer);
      }
    }
  }
}
