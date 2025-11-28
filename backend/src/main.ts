import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {

  // Usamos Nest con Express
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // CORS
  app.enableCors();

  // Prefijo global
  app.setGlobalPrefix('api');

  // Servir archivos estáticos desde /uploads (carpeta raíz del proyecto)
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // Validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Puerto dinámico (para despliegues)
  const PORT = process.env.PORT || 3000;

  // Escuchar en 0.0.0.0 → importante para render/railway/vercel/docker
  await app.listen(PORT, '0.0.0.0');

  console.log(`🚀 Servidor NestJS en http://localhost:${PORT}`);
  console.log(' Archivos estáticos servidos desde "/uploads"');
}

bootstrap();