# Clínica Salud Integral - API

API REST para gestión de clínica médica, construida con NestJS, Prisma y PostgreSQL.

## 🚀 Características

- Autenticación JWT con Guards de autorización por roles
- CRUD completo de Pacientes, Médicos y Citas
- Validación de datos con DTOs y class-validator
- Documentación interactiva con Swagger UI
- Interceptor de logging para monitoreo de requests
- Configuración robusta con ConfigService y validación de variables de entorno
- Filtro global de excepciones de Prisma

## 📡 Documentación de la API

Una vez levantado el servidor, accede a Swagger UI en:
**http://localhost:3000/api/docs**

##  Instalación

```bash
# Clonar el repositorio
git clone <url-del-repo>

# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus valores reales

# Generar cliente de Prisma
pnpm prisma generate

# Ejecutar migraciones
pnpm prisma migrate dev

# Levantar el servidor
pnpm run start:dev
------------------------------------------------------------------------------------------------
Pipeline de NestJS - Recorrido de un Request

Cuando un cliente envía una request para crear una cita, el request atraviesa el siguiente pipeline en este orden exacto:

Guards (JwtAuthGuard + RolesGuard)
¿Hay un token JWT válido en el header Authorization?
¿El usuario tiene el rol RECEPCIONISTA?
Si alguna falla → 401 Unauthorized o 403 Forbidden
Interceptor (LoggingInterceptor) - INICIO
Registra el timestamp de inicio
Captura el método HTTP y la URL
Pipe (ValidationPipe global)
Valida que el body cumpla con CreateCitaDto
Transforma los tipos (string → number, string → Date)
Si falla → 400 Bad Request con mensajes de validación
Controller → Service (CitasController → CitasService)
Ejecuta la lógica de negocio
Inyecta PacientesService para verificar que el paciente existe
Si el paciente no existe → 404 Not Found
Crea la cita en la base de datos vía Prisma
Filter (PrismaExceptionFilter) - SOLO SI HAY ERROR
Si Prisma lanza un error (ej: valor único duplicado), lo traduce a HTTP
P2002 → 409 Conflict
P2025 → 404 Not Found
Interceptor (LoggingInterceptor) - FIN
Calcula el tiempo total de ejecución
Registra en consola: [HTTP] POST /citas — 45ms
La respuesta sale hacia el cliente

Mapa Mental del Pipeline

Request → Guards → Interceptor (inicio) → Pipes → Controller → Service → Interceptor (fin) → Response ↓ (si hay error) 
        Exception Filter

📦 Variables de Entorno

DATABASE_URL="postgresql://postgres:Contraseña@localhost:5432/clinica_salud_integral"
JWT_SECRET=CambiaEstoPorTuClaveSecreta
PORT=3000

🧪 Testing
pnpm test

📝 Scripts disponibles

pnpm run start:dev - Levantar servidor en modo desarrollo
pnpm prisma generate - Regenerar cliente de Prisma
pnpm prisma migrate dev - Ejecutar migraciones
pnpm test - Ejecutar tests


---

### Paso 3: Verificar que Citas tenga documentación Swagger completa

Abre `src/citas/citas.controller.ts` y asegúrate de que tenga todos los decoradores:

```typescript
import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { CitasService } from './citas.service';
import { CreateCitaDto } from './dto/create-cita.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Citas')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('RECEPCIONISTA')
@Controller('citas')
export class CitasController {
  constructor(private readonly citasService: CitasService) {}

  @ApiOperation({ summary: 'Lista todas las citas' })
  @Get()
  findAll() {
    return this.citasService.findAll();
  }

  @ApiOperation({ summary: 'Crea una nueva cita' })
  @ApiBody({ type: CreateCitaDto })
  @Post()
  create(@Body() dto: CreateCitaDto) {
    return this.citasService.create(dto);
  }
}