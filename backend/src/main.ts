// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Habilitar CORS (para tu frontend)
  app.enableCors();
  
  // Prefijo global para todas las rutas
  app.setGlobalPrefix('api');
  
  // Validación automática de DTOs
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Elimina propiedades no definidas en el DTO
    forbidNonWhitelisted: true, // Lanza error si hay propiedades extra
    transform: true, // Transforma tipos automáticamente
  }));
  
  await app.listen(3000);
  console.log(' Servidor NestJS corriendo en http://localhost:3000');
  console.log(' Base de datos:', process.env.DB_DATABASE);
}
bootstrap();