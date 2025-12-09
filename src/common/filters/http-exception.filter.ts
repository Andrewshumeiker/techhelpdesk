import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

/**
 * Global filter to handle exceptions and return a standardized response.
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message: any = null;
    if (exception instanceof HttpException) {
      const res = exception.getResponse();
      message = (res as any).message || res;
    } else if (exception instanceof Error) {
      message = exception.message;
    }
    response.status(status).json({
      success: false,
      data: null,
      message,
    });
  }
}