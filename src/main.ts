import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { BadRequestException, ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as basicAuth from 'express-basic-auth';
import { APP_PORT } from './config';
import { WinstonLoggerService } from '@logger';
import { LoggingInterceptor } from '@interceptors';
import { ParseFiltersPipe } from '@pipes';
import { AllExceptionFilter } from '@exceptions';
import { globalHeaderParametrs } from '@enums';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = app.get(WinstonLoggerService);
  app.useGlobalInterceptors(new LoggingInterceptor(logger));

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'api/v',
  });

  (new ParseFiltersPipe(),
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
        exceptionFactory: (errors) => {
          const firstError = errors.find((error) => error.constraints);
          const message = firstError ? Object.values(firstError.constraints!)[0] : 'Validation error';
          return new BadRequestException(message);
        },
      }),
    ));

  app.useGlobalFilters(new AllExceptionFilter());

  app.use(
    '/docs',
    basicAuth({
      challenge: true,
      users: {
        '1': '1',
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Portal 24 API')
    .setDescription('The Portal24 API description')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    })
    .addGlobalParameters(...globalHeaderParametrs)
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(APP_PORT ?? 3000);
}
bootstrap();
