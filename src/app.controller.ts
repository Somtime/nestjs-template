import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { TransactionInterceptor } from './interceptors/transaction.interceptor';
import { TransactionManager } from './decorators/transaction.decorator';
import { EntityManager } from 'typeorm';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('transaction')
  @UseInterceptors(TransactionInterceptor)
  async transactionDefault(
    @TransactionManager() transactionManager: EntityManager,
  ) {
    return await this.appService.transactionDefault(transactionManager);
  }
}
