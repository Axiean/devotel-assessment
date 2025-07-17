import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
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
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
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
