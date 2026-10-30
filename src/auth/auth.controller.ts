import {
  Controller,
  Post,
  Body,
  Patch,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ApiTags, ApiOperation, ApiBody, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import type { AuthenticatedRequest } from './guards/jwt-auth.guard';

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Registra un nuevo usuario' })
  @ApiBody({ type: RegisterDto })
  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(
      registerDto.email,
      registerDto.password,
      registerDto.role
    );
  }

  @ApiOperation({ summary: 'Inicia sesión y devuelve un token JWT' })
  @ApiBody({ type: LoginDto })
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.email, loginDto.password);
  }

  @ApiOperation({ summary: 'Actualiza el perfil del usuario autenticado' })
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['nombre', 'email'],
      properties: {
        nombre: { type: 'string', example: 'Cristian Feliz' },
        email: { type: 'string', example: 'cris@clinica.com' },
        telefono: { type: 'string', example: '8095551234' },
        foto: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('foto', {
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024, files: 1 },
      fileFilter: (_request, file, callback) => {
        if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.mimetype)) {
          callback(new BadRequestException('La foto debe ser JPEG, PNG, GIF o WebP'), false);
          return;
        }
        callback(null, true);
      },
    }),
  )
  @Patch('profile')
  updateProfile(
    @Req() request: AuthenticatedRequest,
    @Body() datos: UpdateProfileDto,
    @UploadedFile() foto?: Express.Multer.File,
  ) {
    return this.authService.updateProfile(request.user.id, datos, foto);
  }
}