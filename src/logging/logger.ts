import { utilities, WinstonModuleOptions } from 'nest-winston';
import * as winston from 'winston';

import 'winston-daily-rotate-file';

export const winstonOptions: WinstonModuleOptions = {  transports: [
    // 콘솔로 로그를 출력하는 설정
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        utilities.format.nestLike('Bookpecker', {
          prettyPrint: true, // NestJS와 유사한 포맷으로 로그를 출력
        }),
      ),
    }),
    // 로그를 파일로 저장하는 설정
    new winston.transports.DailyRotateFile({
      dirname: 'logs',
      filename: 'application-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true, // 로그 파일을 압축하여 저장
      maxSize: '20m', // 최대 파일 크기 (20MB)
      maxFiles: '14d', // 최대 보관 일수 (14일)
      format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    }),
  ],
};