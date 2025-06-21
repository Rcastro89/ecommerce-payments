import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);
  const port = config.get<number>('PORT') ?? 3000;

  app.enableCors({
    origin: [
      "https://ecommerce-payments-quem51klu-r-castro-m-yahooes-projects.vercel.app/",
      "http://localhost:5173"
    ],
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  await app.listen(port);
  console.log(`🚀 Backend listo en http://localhost:${port}`);
}
bootstrap();
