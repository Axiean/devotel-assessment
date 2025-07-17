import { Test, TestingModule } from '@nestjs/testing';
import { JobOfferController } from './job-offer.controller';
import { JobOfferService } from './job-offer.service';

describe('JobOfferController', () => {
  let controller: JobOfferController;

  const mockJobOfferService = {
    getJobOffers: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobOfferController],
      providers: [
        {
          provide: JobOfferService,
          useValue: mockJobOfferService,
        },
      ],
    }).compile();

    controller = module.get<JobOfferController>(JobOfferController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
