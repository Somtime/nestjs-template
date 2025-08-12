import { resolve } from 'path';
import * as winston from 'winston';
import { utilities, WinstonModule, WinstonModuleOptions } from 'nest-winston';

import * as winstonDaily from 'winston-daily-rotate-file';

const logDirectory = resolve(__dirname, '..', '..', '..', 'logs');

const dailyOptions = (level: string) => {
  return {
    level,
    datePattern: 'YYYY-MM-DD',
    dirname: resolve(logDirectory, level),
    filename: `%DATE%.${level}.log`,
    maxFiles: 30,
    zippedArchive: true,
  };
};

// error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
export const winstonModuleOptions: WinstonModuleOptions = {
  transports: [
    new winston.transports.Console({
      level: process.env.NODE_ENV === 'production' ? 'http' : 'silly',
      format: winston.format.combine(
        winston.format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        utilities.format.nestLike(process.env.APP_NAME, {
          colors: true,
          prettyPrint: true,
        }),
      ),
    }),

    // info, warn, error 로그는 파일로 관리
    new winstonDaily(dailyOptions('info')),
    new winstonDaily(dailyOptions('warn')),
    new winstonDaily(dailyOptions('error')),
  ],
};

export const WinstonLogger = WinstonModule.createLogger(winstonModuleOptions);
