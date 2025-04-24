import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { env } from './config';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors();
  app.setGlobalPrefix(env.api.prefix);
  app.enableVersioning({
    defaultVersion: env.api.version,
    type: VersioningType.URI,
    prefix: env.api.versionPrefix,
  });
  app.useGlobalPipes(new ValidationPipe());
  if (env.swagger === 'true') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Camboloan')
      .setDescription('Camboloan rest api endpoint')
      .setVersion(env.api.version + '.0')
      .addTag('loan')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('swagger', app, document);
  }

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
