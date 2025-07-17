import axios from 'axios';
import { Provider2Strategy } from './provider2.strategy';
import { UnifiedJobOffer } from '../types';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Provider2Strategy', () => {
  let provider2Strategy: Provider2Strategy;

  beforeEach(() => {
    provider2Strategy = new Provider2Strategy();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(provider2Strategy).toBeDefined();
  });

  describe('fetchJobs', () => {
    it('should fetch and transform job offers correctly from the nested structure', async () => {
      const mockApiResponse = {
        data: {
          jobsList: {
            'xyz-789': {
              position: 'Backend Developer',
              employer: {
                companyName: 'Innovate LLC',
              },
              location: {
                city: 'Austin',
                state: 'TX',
              },
              compensation: {
                min: 80000,
                max: 110000,
                currency: 'USD',
              },
              datePosted: '2025-07-16T12:00:00.000Z',
              requirements: {
                technologies: ['Node.js', 'MySQL'],
              },
            },
          },
        },
      };

      mockedAxios.get.mockResolvedValue({ data: mockApiResponse });

      const result: UnifiedJobOffer[] = await provider2Strategy.fetchJobs();

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        title: 'Backend Developer',
        company: 'Innovate LLC',
        location: 'Austin, TX',
        salaryMin: 80000,
        salaryMax: 110000,
        currency: 'USD',
        postedDate: new Date('2025-07-16T12:00:00.000Z'),
        skills: ['Node.js', 'MySQL'],
        externalId: 'provider2-xyz-789',
        source: 'provider2',
      });

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://assignment.devotel.io/api/provider2/jobs',
      );
    });

    it('should handle API errors gracefully', async () => {
      const errorMessage = 'API Unavailable';
      mockedAxios.get.mockRejectedValue(new Error(errorMessage));

      await expect(provider2Strategy.fetchJobs()).rejects.toThrow(errorMessage);
    });
  });
});
