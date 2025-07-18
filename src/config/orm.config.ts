/**
 * This configuration file will be usd by the TypeORM CLI for database migrations.
 * It manually loads environment variables and instantiates ConfigService because
 * the NestJS dependency injection container is not available in the CLI context.
 *
 * For the running application, TypeORM is configured asynchronously in `app.module.ts`
 * to ensure ConfigService is properly injected.
 */

import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import * as path from 'path';
import { isProductionEnvironment } from 'src/utils';
import { DataSource, DataSourceOptions } from 'typeorm';

config({
  path: `.env.${process.env.NODE_ENV}`,
});

const configService = new ConfigService();
const logger = new Logger('DataSource');

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: configService.get<string>('DB_HOST'),
  port: configService.get<number>('DB_PORT'),
  username: configService.get<string>('DB_USER'),
  password: configService.get<string>('DB_PASS'),
  database: configService.get<string>('DB_NAME'),
  entities: [path.join(__dirname, '..', '**', '*.entity.{ts,js}')],
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  // `synchronize: true` is great for development as it automatically updates the schema,
  // but it's unsafe for production. In a production environment, this should be set to `false`
  // and migrations should be used for schema changes.
  synchronize: isProductionEnvironment() ? false : true,
};

const dataSource = new DataSource(dataSourceOptions);

dataSource
  .initialize()
  .then(() => {
    logger.log('✅ Data Source initialized');
  })
  .catch((err) => {
    logger.error('❌ Error during Data Source initialization', err);
  });

export default dataSource;
