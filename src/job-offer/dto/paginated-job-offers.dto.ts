import { ApiProperty } from '@nestjs/swagger';
import { JobOffer } from '../entities/job-offer.entity';

export class PaginatedJobOffersResponse {
  @ApiProperty({
    type: JobOffer,
    description: 'The list of job offers for the current page.',
    isArray: true,
  })
  data: JobOffer[];

  @ApiProperty({
    example: 100,
    description: 'The total number of job offers available.',
  })
  total: number;

  @ApiProperty({ example: 1, description: 'The current page number.' })
  page: number;

  @ApiProperty({ example: 10, description: 'The number of items per page.' })
  limit: number;
}
