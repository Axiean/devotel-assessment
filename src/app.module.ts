import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JobOfferModule } from './job-offer/job-offer.module';
import { SchedulerModule } from './scheduler/scheduler.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { dataSourceOptions } from './config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule } from '@nestjs/config';

@Module({
  // Use forRootAsync to allow for asynchronous configuration,
  // which is useful for loading database credentials from environment variables.
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => dataSourceOptions as TypeOrmModuleOptions,
    }),

    // Configure API rate limiting to prevent abuse.
    // This sets a global limit of 60 requests per minute.
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 60,
      },
    ]),

    // Load and manage environment variables. Setting isGlobal to true
    // makes the ConfigService available application-wide without needing to import ConfigModule in other modules.
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),

    JobOfferModule,
    SchedulerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
