import {
  Injectable,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/api/auth/dto/create-user.dto';
import { UserRepository } from './user.repository';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(
    transactionManager: EntityManager,
    createUserDto: CreateUserDto,
  ) {
    const findUser = await this.userRepository.findById(
      transactionManager,
      createUserDto.id,
    );

    if (findUser) throw new ForbiddenException('이미 존재하는 사용자입니다.');
    const hashedPassword = await bcrypt.hash(createUserDto.password, 12);
    createUserDto.password = hashedPassword;

    const newUser: User = this.userRepository.create(createUserDto);
    const createdUser = await transactionManager.save(newUser);

    const payload = {
      id: createdUser.id,
      name: createdUser.name,
      phone: createdUser.phone,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signIn(
    transactionManager: EntityManager,
    id: string,
    password: string,
  ): Promise<any> {
    const user = await this.userRepository.findById(transactionManager, id);
    if (!user) throw new UnauthorizedException('존재하지 않는 사용자입니다.');

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');

    const payload = {
      idx: user.idx,
      id: user.id,
      name: user.name,
      phone: user.phone,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async update(
    transactionManager: EntityManager,
    idx: number,
    updateUserDto: UpdateUserDto,
  ) {
    const user = this.userRepository.create(updateUserDto);
    user.idx = idx;
    transactionManager.save(user);
  }

  async remove(transactionManager: EntityManager, idx: number) {
    return await transactionManager.delete(User, idx);
  }
}
