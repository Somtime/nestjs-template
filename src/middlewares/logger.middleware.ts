import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { isEmpty } from 'lodash';
import { WinstonLogger } from 'src/loggers/winston.config';
import { UserToken } from 'src/decorators/user.decorator';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = WinstonLogger;

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, originalUrl, body } = request;
    const userAgent = request.get('user-agent') || '';
    const startHrTime = process.hrtime();

    // 응답이 끝났을 때
    response.on('finish', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length') || 0;
      const diff = process.hrtime(startHrTime);
      const responseTimeMs = Math.round((diff[0] * 1e9 + diff[1]) / 1e6);
      let logMessage = `${method} ${originalUrl} ${statusCode} ${contentLength} - ${userAgent} ${ip} ${responseTimeMs}ms`;
      if (!isEmpty(body)) {
        logMessage += ` body: ${JSON.stringify(body)}`;
      }
      const authUser = (request as Request & { user?: UserToken }).user;
      if (authUser) {
        logMessage += ` user: ${authUser.idx}`;
      }

      this.logger.log(logMessage);
    });

    next();
  }
}
