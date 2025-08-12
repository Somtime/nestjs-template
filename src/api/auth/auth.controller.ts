import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  UseGuards,
  Param,
  UseInterceptors,
  Logger,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { TransactionInterceptor } from 'src/interceptors/transaction.interceptor';
import { TransactionManager } from 'src/decorators/transaction.decorator';
import { EntityManager } from 'typeorm';
import { User, UserToken } from 'src/decorators/user.decorator';

@UseInterceptors(TransactionInterceptor)
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(this.constructor.name);

  constructor(private readonly authService: AuthService) {}

  @Post('signIn')
  signIn(
    @Body() signInDto: Record<string, any>,
    @TransactionManager() transactionManager: EntityManager,
  ) {
    return this.authService.signIn(
      transactionManager,
      signInDto.id,
      signInDto.password,
    );
  }

  @Post('signUp')
  signUp(
    @Body() createUserDto: CreateUserDto,
    @TransactionManager() transactionManager: EntityManager,
  ) {
    return this.authService.signUp(transactionManager, createUserDto);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@User() user: UserToken): UserToken {
    return user;
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
    @TransactionManager() transactionManager: EntityManager,
  ) {
    return this.authService.update(transactionManager, +id, updateUserDto);
  }

  @Delete(':id')
  remove(
    @Param('id') id: number,
    @TransactionManager() transactionManager: EntityManager,
  ) {
    return this.authService.remove(transactionManager, +id);
  }
}
