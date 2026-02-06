import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as morgan from 'morgan';
import * as cors from 'cors';
import { GlobalExceptionFilter } from './middleware/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global middleware
  app.use(morgan('combined'));
  app.use(cors());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
  app.useGlobalFilters(new GlobalExceptionFilter());

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();