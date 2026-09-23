import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { PrismaExceptionFilter } from './prisma/prisma-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ValidationPipe global
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true
  }));

  // Exception Filter global
  app.useGlobalFilters(new PrismaExceptionFilter());

  // Configuración de Swagger con orden personalizado
  const config = new DocumentBuilder()
    .setTitle('Clínica Salud Integral')
    .setDescription('API de la clínica, migrada a NestJS')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('App', 'Endpoints generales')
    .addTag('Autenticación', 'Registro y login de usuarios')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();