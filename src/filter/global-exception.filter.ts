import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { GqlArgumentsHost, GqlExceptionFilter } from '@nestjs/graphql';
import { Request, Response } from 'express';
import { GraphQLError } from 'graphql';
import { Logger } from 'winston';

interface GraphQLErrorResponse {
  extensions: {
    statusCode: number;
    timestamp: string;
    path?: string;
    message: string | object;
  };
  message: string | object;
}

@Catch()
export class GlobalExceptionsFilter implements ExceptionFilter, GqlExceptionFilter {
  constructor(private readonly logger: Logger) {}

  /**
   * 예외 발생 시 호출
   * @param exception
   * @param host
   */
  catch(exception: unknown, host: ArgumentsHost): void | GraphQLErrorResponse {
    if (host.getType() === 'http') {
      // HTTP 요청 처리
      //HTTP request, response를 가져옴
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const request = ctx.getRequest<Request>();

      //예외가 HttpException인 경우 상태 코드를 가져오고,
      //그 외의 경우에는 500 상태 코드로 처리
      const status =
        exception instanceof HttpException
          ? exception.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR;

      const message =
        exception instanceof HttpException ? exception.getResponse() : 'Internal server error';

      //클라이언트에게 응답할 에러 Response
      const errorResponse = {
        statusCode: status,
        timestamp: new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }), // 한국 시간으로 변환
        path: request.url,
        message,
      };

      //로거에 에러 정보 기록
      this.logger.error(`${request.method} ${request.url}`, {
        error: errorResponse,
        stack: exception instanceof Error ? exception.stack : 'No stack trace',
      });

      //에러를 JSON 형식으로 전송
      response.status(status).json(errorResponse);
    } else {
      // GraphQL 요청 처리
      const gqlHost = GqlArgumentsHost.create(host);
      const context = gqlHost.getContext();

      const status =
        exception instanceof HttpException
          ? exception.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR;

      let message: string | object = 'Internal server error';

      if (exception instanceof HttpException) {
        const response = exception.getResponse();
        message =
          typeof response === 'string'
            ? response
            : (response as { message?: string }).message || 'Internal server error';
      }

      const errorResponse = {
        statusCode: status,
        timestamp: new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }),
        path: context.req ? context.req.url : undefined,
        message,
      };

      const request = context.req;
      if (request) {
        errorResponse['path'] = request.url;
        this.logger.error(`GraphQL ${request.body.operationName}`, {
          error: errorResponse,
          stack: exception instanceof Error ? exception.stack : 'No stack trace',
        });
      } else {
        this.logger.error('GraphQL Error', {
          error: errorResponse,
          stack: exception instanceof Error ? exception.stack : 'No stack trace',
        });
      }

      throw new GraphQLError(typeof message === 'string' ? message : JSON.stringify(message), {
        extensions: errorResponse,
      });
    }
  }
}
