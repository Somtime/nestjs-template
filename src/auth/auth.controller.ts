import {
  Body,
  Controller,
  Request,
  Get,
  Post,
  Patch,
  Delete,
  UseGuards,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { TransactionInterceptor } from 'src/interceptors/transaction.interceptor';
import { TransactionManager } from 'src/decorators/transaction.decorator';
import { EntityManager } from 'typeorm';

@UseInterceptors(TransactionInterceptor)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signIn')
  signIn(
    @Body() signInDto: Record<string, any>,
    @TransactionManager() TransactionManager: EntityManager,
  ) {
    return this.authService.signIn(
      TransactionManager,
      signInDto.id,
      signInDto.password,
    );
  }

  @Post('signUp')
  signUp(
    @Body() createUserDto: CreateUserDto,
    @TransactionManager() TransactionManager: EntityManager,
  ) {
    return this.authService.signUp(TransactionManager, createUserDto);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req): any {
    return req.user;
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
    @TransactionManager() TransactionManager: EntityManager,
  ) {
    return this.authService.update(TransactionManager, +id, updateUserDto);
  }

  @Delete(':id')
  remove(
    @Param('id') id: number,
    @TransactionManager() TransactionManager: EntityManager,
  ) {
    return this.authService.remove(TransactionManager, +id);
  }
}
