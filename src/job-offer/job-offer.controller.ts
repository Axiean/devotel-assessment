import { Controller, Get, Query } from '@nestjs/common';
import { JobOfferService } from './job-offer.service';
import { GetJobOffersDto, PaginatedJobOffersResponse } from './dto';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('job-offer')
@Controller('job-offer')
export class JobOfferController {
  constructor(private readonly jobOfferService: JobOfferService) {}

  @Get('/list')
  @ApiOperation({
    summary: 'Retrieve a paginated list of job offers',
    description:
      'Fetches job offers from the database with support for filtering and pagination.',
  })
  @ApiOkResponse({
    description: 'Successfully retrieved job offers.',
    type: PaginatedJobOffersResponse,
  })
  getJobOffers(@Query() getJobOffersDto: GetJobOffersDto) {
    return this.jobOfferService.getJobOffers(getJobOffersDto);
  }
}
