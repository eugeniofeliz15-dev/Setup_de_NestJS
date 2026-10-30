import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'node:crypto';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '../../generated/prisma';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService 
  ) {}

  async register(email: string, password: string, role: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: role as Role,
      },
      select: { id: true, email: true, role: true },
    });
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        role: true,
        firstName: true,
        lastName: true,
        phone: true,
        photoUrl: true,
      },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      this.configService.getOrThrow<string>('JWT_SECRET'),
      { expiresIn: '8h' }
    );

    return {
      token,
      usuario: this.toPublicUser(user),
    };
  }

  async updateProfile(userId: number, datos: UpdateProfileDto, foto?: Express.Multer.File) {
    const [firstName, ...lastNameParts] = datos.nombre.trim().split(/\s+/);
    const photoExtension = foto ? this.validatePhoto(foto) : undefined;
    const photoDirectory = join(process.cwd(), 'uploads', 'avatars');
    const photoFilename = photoExtension ? `${randomUUID()}.${photoExtension}` : undefined;
    const photoPath = photoFilename ? join(photoDirectory, photoFilename) : undefined;

    if (foto && photoPath) {
      await mkdir(photoDirectory, { recursive: true });
      await writeFile(photoPath, foto.buffer);
    }

    try {
      const user = await this.prisma.user.update({
        where: { id: userId },
        data: {
          email: datos.email,
          firstName,
          lastName: lastNameParts.join(' ') || null,
          phone: datos.telefono || null,
          ...(photoFilename ? { photoUrl: `/uploads/avatars/${photoFilename}` } : {}),
        },
        select: {
          id: true,
          email: true,
          role: true,
          firstName: true,
          lastName: true,
          phone: true,
          photoUrl: true,
        },
      });

      return this.toPublicUser(user);
    } catch (error) {
      if (photoPath) {
        await rm(photoPath, { force: true });
      }
      throw error;
    }
  }

  private validatePhoto(foto: Express.Multer.File): string {
    const signatures: Record<string, (buffer: Buffer) => boolean> = {
      'image/jpeg': (buffer) => buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff,
      'image/png': (buffer) =>
        buffer.length >= 8
        && buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])),
      'image/gif': (buffer) =>
        buffer.subarray(0, 6).toString('ascii') === 'GIF87a'
        || buffer.subarray(0, 6).toString('ascii') === 'GIF89a',
      'image/webp': (buffer) =>
        buffer.subarray(0, 4).toString('ascii') === 'RIFF'
        && buffer.subarray(8, 12).toString('ascii') === 'WEBP',
    };
    const extensions: Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/gif': 'gif',
      'image/webp': 'webp',
    };
    const isValidImage = signatures[foto.mimetype]?.(foto.buffer);

    if (!isValidImage) {
      throw new BadRequestException('El archivo seleccionado no es una imagen válida');
    }

    return extensions[foto.mimetype];
  }

  private toPublicUser(user: {
    id: number;
    email: string;
    role: Role;
    firstName: string | null;
    lastName: string | null;
    phone: string | null;
    photoUrl: string | null;
  }) {
    const nombre = [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email;

    return {
      id: user.id,
      nombre,
      email: user.email,
      rol: user.role,
      telefono: user.phone,
      foto: user.photoUrl,
    };
  }
}