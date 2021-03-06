import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true,
    credentials: true,
  });
  app.setGlobalPrefix('api');
  console.log(`Listened on PORT ${process.env.PORT || 3000}`);
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
