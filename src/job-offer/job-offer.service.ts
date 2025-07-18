import { Injectable } from '@nestjs/common';
import { JobOffer } from './entities/job-offer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DataSource,
  FindManyOptions,
  LessThanOrEqual,
  Like,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { JobProviderService } from './providers/job-provider.service';
import { GetJobOffersDto, PaginatedJobOffersResponse } from './dto';

@Injectable()
export class JobOfferService {
  constructor(
    @InjectRepository(JobOffer)
    private readonly repo: Repository<JobOffer>,
    private readonly jobProviderService: JobProviderService,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Retrieves a paginated and filtered list of job offers.
   * This method constructs a dynamic query based on the provided DTO.
   *
   * @param getJobOffersDto - DTO containing filter and pagination parameters.
   * @returns A promise that resolves to a paginated response of job offers.
   */
  async getJobOffers(
    getJobOffersDto: GetJobOffersDto,
  ): Promise<PaginatedJobOffersResponse> {
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
      (query.where as any)['title'] = Like(`%${title}%`);
    }
    if (location) {
      (query.where as any)['location'] = Like(`%${location}%`);
    }
    if (minSalary) {
      (query.where as any)['salaryMin'] = MoreThanOrEqual(minSalary);
    }
    if (maxSalary) {
      (query.where as any)['salaryMax'] = LessThanOrEqual(maxSalary);
    }

    const [data, total] = await this.repo.findAndCount(query);

    return { data, total, page, limit };
  }

  /**
   * Fetches job offers from all registered providers and saves new ones to the database.
   * It uses a transaction to ensure that the entire sync operation is atomic.
   * If any part of the sync fails, the entire transaction will be rolled back.
   */
  async syncAll() {
    const offers = await this.jobProviderService.fetchAll();

    await this.dataSource.transaction(async (entityManager) => {
      for (const offer of offers) {
        const exists = await entityManager.findOneBy(JobOffer, {
          externalId: offer.externalId,
        });
        if (!exists) {
          const newOffer = entityManager.create(JobOffer, offer);
          await entityManager.save(newOffer);
        }
      }
    });
  }
}
