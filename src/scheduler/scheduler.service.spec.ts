import { Test, TestingModule } from '@nestjs/testing';
import { SchedulerService } from './scheduler.service';
import { JobOfferService } from '../job-offer/job-offer.service';
import { Logger } from '@nestjs/common';

const mockJobOfferService = {
  syncAll: jest.fn(),
};

describe('SchedulerService', () => {
  let schedulerService: SchedulerService;
  let jobOfferService: JobOfferService;

  beforeEach(async () => {
    jest.spyOn(Logger.prototype, 'log').mockImplementation(() => {});
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SchedulerService,
        {
          provide: JobOfferService,
          useValue: mockJobOfferService,
        },
      ],
    }).compile();

    schedulerService = module.get<SchedulerService>(SchedulerService);
    jobOfferService = module.get<JobOfferService>(JobOfferService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(schedulerService).toBeDefined();
  });

  describe('handleJobOfferSync', () => {
    it('should call jobOfferService.syncAll when the cron job is triggered', async () => {
      mockJobOfferService.syncAll.mockResolvedValue(undefined);

      await schedulerService.handleJobOfferSync();

      expect(jobOfferService.syncAll).toHaveBeenCalledTimes(1);
    });

    it('should log an error if syncAll fails', async () => {
      const error = new Error('Sync failed');
      mockJobOfferService.syncAll.mockRejectedValue(error);
      const loggerErrorSpy = jest.spyOn(
        (schedulerService as any).logger,
        'error',
      );

      await schedulerService.handleJobOfferSync();

      expect(jobOfferService.syncAll).toHaveBeenCalledTimes(1);
      expect(loggerErrorSpy).toHaveBeenCalledWith(
        'Failed to sync job offers',
        error,
      );
    });
  });
});
