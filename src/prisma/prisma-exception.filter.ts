import { 
  ArgumentsHost, 
  Catch, 
  ConflictException, 
  ExceptionFilter, 
  NotFoundException 
} from '@nestjs/common';
import { Prisma } from '../../generated/prisma';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    switch (exception.code) {
      case 'P2002': 
        return response
          .status(409)
          .json({
            statusCode: 409,
            message: 'Ya existe un registro con ese valor único',
            error: 'Conflict'
          });
      
      case 'P2025': 
        return response
          .status(404)
          .json({
            statusCode: 404,
            message: 'Registro no encontrado',
            error: 'Not Found'
          });
      
      default:
      
        return response
          .status(500)
          .json({
            statusCode: 500,
            message: 'Error interno del servidor',
            error: 'Internal Server Error'
          });
    }
  }
}