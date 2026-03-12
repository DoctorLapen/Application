import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Response, Request } from 'express';
import { UserAlreadyExistError, UserNotFoundError, WrongPasswordError } from '../errors/errors';
;

@Catch(UserAlreadyExistError, UserNotFoundError, WrongPasswordError)
export class AuthExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof UserAlreadyExistError) {
      status = HttpStatus.CONFLICT;
      message = exception.message;
    } else if (exception instanceof UserNotFoundError) {
      status = HttpStatus.NOT_FOUND;
      message = exception.message;
    } else if (exception instanceof WrongPasswordError) {
      status = HttpStatus.UNAUTHORIZED;
      message = exception.message;
    }

    response.status(status).json({
      message,
    });
  }
}