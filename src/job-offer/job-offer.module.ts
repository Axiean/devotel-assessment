import { Module } from '@nestjs/common';
import { JobOfferController } from './job-offer.controller';
import { JobOfferService } from './job-offer.service';
import { JobOffer } from './entities/job-offer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobProviderService } from './providers/job-provider.service';
import { Provider1Strategy } from './providers/provider1.strategy';
import { Provider2Strategy } from './providers/provider2.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([JobOffer])],
  controllers: [JobOfferController],
  providers: [
    JobOfferService,
    JobProviderService,
    Provider1Strategy,
    Provider2Strategy,
  ],
  exports: [JobOfferService],
})
export class JobOfferModule {}
