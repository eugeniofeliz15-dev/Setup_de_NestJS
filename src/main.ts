import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import express from 'express';
import { join } from 'node:path';
import { AppModule } from './app.module';
import { PrismaExceptionFilter } from './prisma/prisma-exception.filter';
import { LoggingInterceptor } from './common/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Servir archivos estáticos para los avatares
  app.use(
    '/uploads/avatars',
    express.static(join(process.cwd(), 'uploads', 'avatars'), {
      dotfiles: 'deny',
      index: false,
      maxAge: '1d',
    }),
  );

  // Configuración de CORS
  const corsOrigins = (process.env.CORS_ORIGINS ?? 'http://localhost:5173,http://localhost:5174')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.enableCors({
    origin: corsOrigins,
    credentials: true,
  });

  // ValidationPipe global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // Exception Filter global
  app.useGlobalFilters(new PrismaExceptionFilter());

  // Interceptor de Logging global
  app.useGlobalInterceptors(new LoggingInterceptor());

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('Clínica Salud Integral')
    .setDescription('API de la clínica, migrada a NestJS')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('App', 'Endpoints generales')
    .addTag('Autenticación', 'Registro y login de usuarios')
    .addTag('Pacientes', 'Gestión de pacientes')
    .addTag('Médicos', 'Gestión de médicos')
    .addTag('Citas', 'Gestión de citas')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // ✅ CORRECCIÓN: Forzar puerto 3000 y escuchar en todas las interfaces (0.0.0.0)
  // Esto evita problemas de IPv4/IPv6 en Windows y fallos silenciosos del ConfigService
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  
  await app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 ¡Backend corriendo con éxito en http://localhost:${port}`);
    console.log(`📚 Swagger docs disponibles en http://localhost:${port}/api/docs`);
  });
}

// ✅ CORRECCIÓN: Manejo de errores para que no se quede colgado en silencio
bootstrap().catch((error) => {
  console.error('❌ Error fatal al iniciar el backend:', error);
  process.exit(1);
});