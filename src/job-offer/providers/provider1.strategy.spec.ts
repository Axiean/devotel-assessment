import axios from 'axios';
import { Provider1Strategy } from './provider1.strategy';
import { UnifiedJobOffer } from '../types';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';

// Mock the axios module
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Provider1Strategy', () => {
  let provider1Strategy: Provider1Strategy;

  const mockConfigService = {
    get: jest
      .fn()
      .mockReturnValue('https://assignment.devotel.io/api/provider1/jobs'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Provider1Strategy,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    provider1Strategy = module.get<Provider1Strategy>(Provider1Strategy);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(provider1Strategy).toBeDefined();
  });

  describe('fetchJobs', () => {
    it('should fetch and transform job offers correctly', async () => {
      const mockApiResponse = {
        jobs: [
          {
            jobId: '123',
            title: 'Senior Software Engineer',
            company: {
              name: 'Tech Corp',
            },
            details: {
              location: 'San Francisco, CA',
              salaryRange: '$120k - $150k',
            },
            postedDate: '2025-07-17T10:00:00.000Z',
            skills: ['TypeScript', 'Node.js', 'React'],
          },
        ],
      };

      mockedAxios.get.mockResolvedValue({ data: mockApiResponse });

      const result: UnifiedJobOffer[] = await provider1Strategy.fetchJobs();

      // Assert: Check if the transformation was successful
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        title: 'Senior Software Engineer',
        company: 'Tech Corp',
        location: 'San Francisco, CA',
        salaryMin: 120000,
        salaryMax: 150000,
        currency: 'USD',
        postedDate: new Date('2025-07-17T10:00:00.000Z'),
        skills: ['TypeScript', 'Node.js', 'React'],
        externalId: 'provider1-123',
        source: 'provider1',
      });

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://assignment.devotel.io/api/provider1/jobs',
      );
    });

    it('should handle API errors gracefully', async () => {
      const errorMessage = 'Network Error';
      mockedAxios.get.mockRejectedValue(new Error(errorMessage));

      await expect(provider1Strategy.fetchJobs()).rejects.toThrow(errorMessage);
    });
  });
});
