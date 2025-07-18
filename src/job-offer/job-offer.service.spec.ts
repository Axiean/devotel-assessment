import { Test, TestingModule } from '@nestjs/testing';
import { JobOfferService } from './job-offer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobOffer } from './entities/job-offer.entity';
import { JobProviderService } from './providers/job-provider.service';
import { Provider1Strategy } from './providers/provider1.strategy';
import { Provider2Strategy } from './providers/provider2.strategy';
import { GetJobOffersDto } from './dto/get-job-offers.dto';
import { Repository } from 'typeorm';
import { ConfigModule } from '@nestjs/config';

const mockJobProviderService = {
  fetchAll: jest.fn(),
};

describe('JobOfferService (Integration)', () => {
  let service: JobOfferService;
  let repository: Repository<JobOffer>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [JobOffer],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([JobOffer]),

        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: `.env.${process.env.NODE_ENV}`,
        }),
      ],
      providers: [
        JobOfferService,
        JobProviderService,
        Provider1Strategy,
        Provider2Strategy,
      ],
    })
      .overrideProvider(JobProviderService)
      .useValue(mockJobProviderService)
      .compile();

    service = module.get<JobOfferService>(JobOfferService);
    repository = module.get('JobOfferRepository');
  });

  afterEach(async () => {
    await repository.clear();
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('syncAll', () => {
    it('should save new job offers and skip existing ones', async () => {
      const existingOffer = {
        externalId: 'provider1-123',
        title: 'Existing Job',
        company: 'Old Corp',
        location: 'City',
        postedDate: new Date(),
      };
      await repository.save(existingOffer);

      const fetchedOffers = [
        { ...existingOffer },
        {
          externalId: 'provider1-456',
          title: 'New Job',
          company: 'New Corp',
          location: 'Town',
          postedDate: new Date(),
        },
      ];
      mockJobProviderService.fetchAll.mockResolvedValue(fetchedOffers);

      await service.syncAll();

      const allOffersInDb = await repository.find();
      expect(allOffersInDb).toHaveLength(2); // Should have the initial and the new one
      expect(mockJobProviderService.fetchAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('getJobOffers', () => {
    beforeEach(async () => {
      const offers = [
        {
          title: 'Software Engineer',
          location: 'New York',
          salaryMin: 100000,
          salaryMax: 120000,
          externalId: '1',
          source: 'p1',
          company: 'A',
          postedDate: new Date('2025-01-01'),
        },
        {
          title: 'Data Scientist',
          location: 'San Francisco',
          salaryMin: 120000,
          salaryMax: 150000,
          externalId: '2',
          source: 'p2',
          company: 'B',
          postedDate: new Date('2025-01-02'),
        },
        {
          title: 'Software Engineer',
          location: 'San Francisco',
          salaryMin: 110000,
          salaryMax: 130000,
          externalId: '3',
          source: 'p1',
          company: 'C',
          postedDate: new Date('2025-01-03'),
        },
      ];
      await repository.save(offers);
    });

    it('should return paginated results', async () => {
      const dto: GetJobOffersDto = { page: 1, limit: 2 };
      const result = await service.getJobOffers(dto);
      expect(result.data).toHaveLength(2);
      expect(result.total).toBe(3);
      expect(result.page).toBe(1);
    });

    it('should filter by title', async () => {
      const dto: GetJobOffersDto = { title: 'Data Scientist' };
      const result = await service.getJobOffers(dto);
      expect(result.data).toHaveLength(1);
      expect(result.data[0].title).toBe('Data Scientist');
    });

    it('should filter by location', async () => {
      const dto: GetJobOffersDto = { location: 'San Francisco' };
      const result = await service.getJobOffers(dto);
      expect(result.data).toHaveLength(2);
    });
  });
});
