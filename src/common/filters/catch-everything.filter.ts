import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost } from '@nestjs/core';

@Injectable()
@Catch()
export class CatchEverythingFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly configService: ConfigService,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorMessage =
      exception instanceof Error
        ? exception.message
        : typeof exception === 'string'
          ? exception
          : JSON.stringify(exception);

    const errorResponse =
      exception instanceof HttpException ? exception.getResponse() : null;

    const nodeEnv = this.configService.get<string>('app.nodeEnv');
    const isDevelopment = nodeEnv === 'development';

    // Base response structure
    const responseBody = {
      status: 'error' as const,
      statusCode: httpStatus,
      message: isDevelopment ? errorMessage : this.getProductionMessage(httpStatus),
      timestamp: new Date().toISOString(),
      path: request.url || request.path || 'unknown',
    };

    // Add development-specific details
    if (isDevelopment) {
      Object.assign(responseBody, {
        ...(exception instanceof Error && { stack: exception.stack }),
        ...(errorResponse && { details: errorResponse }),
        environment: nodeEnv,
        requestId: this.generateRequestId(),
      });
    } else {
      // Production-specific handling
      Object.assign(responseBody, {
        ...(errorResponse && 
          typeof errorResponse === 'object' && 
          'message' in errorResponse && { 
            details: { message: errorResponse.message } 
          }),
        requestId: this.generateRequestId(),
      });
    }

    // Enhanced logging based on environment
    this.logError(exception, responseBody, isDevelopment);

    // Send response
    if (httpAdapter && httpAdapter.reply) {
      httpAdapter.reply(response, responseBody, httpStatus);
    } else {
      // Fallback for cases where httpAdapter is not available
      response.status(httpStatus).json(responseBody);
    }
  }

  private getProductionMessage(httpStatus: number): string {
    switch (httpStatus) {
      case HttpStatus.BAD_REQUEST:
        return 'Invalid request parameters';
      case HttpStatus.UNAUTHORIZED:
        return 'Authentication required';
      case HttpStatus.FORBIDDEN:
        return 'Access denied';
      case HttpStatus.NOT_FOUND:
        return 'Resource not found';
      case HttpStatus.METHOD_NOT_ALLOWED:
        return 'Method not allowed';
      case HttpStatus.TOO_MANY_REQUESTS:
        return 'Rate limit exceeded';
      case HttpStatus.INTERNAL_SERVER_ERROR:
        return 'Internal server error';
      case HttpStatus.SERVICE_UNAVAILABLE:
        return 'Service temporarily unavailable';
      default:
        return 'An error occurred';
    }
  }

  private logError(exception: unknown, responseBody: any, isDevelopment: boolean): void {
    const logLevel = this.configService.get<string>('logging.logLevel');
    
    if (isDevelopment || logLevel === 'debug') {
      console.error('🚨 Exception Details:', {
        exception: exception instanceof Error ? exception.message : exception,
        stack: exception instanceof Error ? exception.stack : undefined,
        response: responseBody,
        timestamp: new Date().toISOString(),
      });
    } else {
      // Production logging - less verbose
      console.error('Error:', {
        message: responseBody.message,
        statusCode: responseBody.statusCode,
        path: responseBody.path,
        requestId: responseBody.requestId,
        timestamp: responseBody.timestamp,
      });
    }
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
