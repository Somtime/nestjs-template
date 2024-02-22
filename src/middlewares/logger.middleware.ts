import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { isEmpty } from 'lodash';
import { WinstonLogger } from 'src/common/utils/winston.util';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = WinstonLogger;

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, originalUrl, body } = request;
    const userAgent = request.get('user-agent') || '';

    const timestamp = this.getTime();

    // 응답이 끝났을 때
    response.on('finish', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length') || 0;
      let logMessage = `${timestamp} - ${method} ${originalUrl} ${statusCode} ${contentLength} - ${userAgent} ${ip}`;
      if (!isEmpty(body)) {
        logMessage += `\nbody: ${JSON.stringify(body)}`;
      }

      this.logger.log(logMessage);
    });

    next();
  }

  private getTime(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
}