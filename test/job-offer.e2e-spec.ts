import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { JobOfferService } from '../src/job-offer/job-offer.service';

describe('JobOfferController (e2e)', () => {
  let app: INestApplication;

  const mockJobOfferService = {
    getJobOffers: jest.fn().mockResolvedValue({
      data: [{ title: 'Mock Job' }],
      total: 1,
      page: 1,
      limit: 10,
    }),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(JobOfferService)
      .useValue(mockJobOfferService)
      .compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/job-offer/list (GET) - should return job offers', () => {
    return request(app.getHttpServer())
      .get('/job-offer/list')
      .expect(200)
      .expect(mockJobOfferService.getJobOffers);
  });

  it('/job-offer/list (GET) - should pass valid query params to the service', async () => {
    const query = 'title=Engineer&location=Remote&page=2&limit=20';
    await request(app.getHttpServer())
      .get(`/job-offer/list?${query}`)
      .expect(200);

    expect(mockJobOfferService.getJobOffers).toHaveBeenCalledWith({
      title: 'Engineer',
      location: 'Remote',
      page: 2,
      limit: 20,
    });
  });

  it('/job-offer/list (GET) - should return 400 for invalid query params', () => {
    return request(app.getHttpServer())
      .get('/job-offer/list?limit=999')
      .expect(400);
  });
});
