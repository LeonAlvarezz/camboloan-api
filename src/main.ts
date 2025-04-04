import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { config } from './config';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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
  if (config.swagger === 'true') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Camboloan')
      .setDescription('Camboloan rest api endpoint')
      .setVersion(config.api.version + '.0')
      .addTag('loan')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('swagger', app, document);
  }

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
