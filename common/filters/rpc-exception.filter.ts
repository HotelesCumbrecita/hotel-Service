import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Catch()
export class RpcExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(RpcExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToRpc();
    const data = ctx.getData();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof RpcException) {
      const errorResponse = exception.getError();
      message =
        typeof errorResponse === 'string'
          ? errorResponse
          : errorResponse['message'] || message;
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const errorResponse = exception.getResponse();
      message =
        typeof errorResponse === 'string'
          ? errorResponse
          : errorResponse['message'] || message;
    } else {
      this.logger.error(`Unhandled exception: ${exception}`);
    }

    return {
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      data,
    };
  }
}
