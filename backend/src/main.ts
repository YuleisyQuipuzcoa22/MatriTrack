import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express'; 
import { join } from 'path'; 

async function bootstrap() {
  // Especificar que usamos Express
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors();
  app.setGlobalPrefix('api');

  // Servir archivos estáticos desde la carpeta 'uploads'
  // __dirname es 'dist'
  // join(__dirname, '..', 'uploads') apunta a la carpeta 'uploads' en la raíz del proyecto
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/', // Los archivos estarán disponibles en /uploads/filename.pdf
  });
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true, 
      transform: true,
    }),
  );

  await app.listen(3000);
  console.log(' Servidor NestJS corriendo en http://localhost:3000');
  console.log(' Sirviendo archivos estáticos desde la carpeta /uploads');
  console.log(' Base de datos:', process.env.DB_DATABASE);
}
bootstrap();