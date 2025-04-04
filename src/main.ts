import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { config } from './config';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors();
  app.setGlobalPrefix(config.api.prefix);
  app.enableVersioning({
    defaultVersion: config.api.version,
    type: VersioningType.URI,
    prefix: config.api.versionPrefix,
  });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
