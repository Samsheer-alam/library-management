import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // Get app config.
  const configService = app.get(ConfigService);
  const port = configService.get('port');

  await app
    .listen(port)
    .then(() => console.log(`Server running at port ${port}`));
}
bootstrap();
