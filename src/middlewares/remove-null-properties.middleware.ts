import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RemoveNullPropertiesMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const dto = req.body; // 요청의 바디에서 DTO 추출

    // 재귀적으로 DTO를 탐색하여 null인 프로퍼티 제거
    function removeNullProperties(obj: any) {
      for (const prop in obj) {
        if (obj[prop] === null) {
          delete obj[prop];
        } else if (obj[prop] === 0) {
          delete obj[prop];
        } else if (typeof obj[prop] === 'object') {
          removeNullProperties(obj[prop]);
        }
      }
    }

    removeNullProperties(dto); // null인 프로퍼티 제거

    req.body = dto; // 수정된 DTO를 요청 바디에 다시 할당
    next(); // 다음 미들웨어로 이동
  }
}
