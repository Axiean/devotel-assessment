import { Controller, Get, Query } from '@nestjs/common';
import { JobOfferService } from './job-offer.service';
import { GetJobOffersDto } from './dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('job-offer')
@Controller('job-offer')
export class JobOfferController {
  constructor(private readonly jobOfferService: JobOfferService) {}

  @Get('/list')
  getJobOffers(@Query() getJobOffersDto: GetJobOffersDto) {
    return this.jobOfferService.getJobOffers(getJobOffersDto);
  }
}
