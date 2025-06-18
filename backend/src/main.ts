import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);
  const port = config.get<number>('PORT') ?? 3000;
  const origin = config.get<string>('CORS_ORIGIN') ?? '*';

  app.enableCors({
    origin,
    credentials: true,
  });

  await app.listen(port);
  console.log(`🚀 Backend listo en http://localhost:${port}`);
}
bootstrap();
