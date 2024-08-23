import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class TravelExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const http = host.switchToHttp();
    const response = http.getResponse<Response>();
    const status = exception.getStatus();

    const result = exception.getResponse() as { message: string | string[] };

    response.status(status).json({
      code: -1,
      message: Array.isArray(result.message)
        ? result.message.join(',')
        : exception.message,
      data: null,
    });
  }
}
