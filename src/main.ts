import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './shared/filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.use(helmet());

  // Set a global prefix for all routes to 'api'.
  // This is a good practice for versioning and organizing your API.
  app.setGlobalPrefix('api');

  // Register a global exception filter to catch all unhandled exceptions
  // and provide a consistent, structured error response.
  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost));

  // Use a global validation pipe to automatically validate incoming request bodies (DTOs).
  // `transform: true` automatically transforms payloads to DTO instances.
  // `whitelist: true` strips any properties that do not have decorators in the DTO.
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Devotel')
    .setDescription('Devotel assessment API')
    .setVersion('0.1')
    .addServer('/')
    .build();

  const swaggerOptions: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };

  const document = SwaggerModule.createDocument(
    app,
    swaggerConfig,
    swaggerOptions,
  );
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
