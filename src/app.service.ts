import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  transactionDefault(transactionManager: EntityManager) {
    throw new Error('Method not implemented.');
  }
}
