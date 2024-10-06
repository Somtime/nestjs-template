import {
  Injectable,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signUp(createUserDto: CreateUserDto) {
    const findUser = await this.userService.findById(createUserDto.id);

    if (findUser) throw new ForbiddenException('이미 존재하는 사용자입니다.');
    const hashedPassword = await bcrypt.hash(createUserDto.password, 12);
    createUserDto.password = hashedPassword;

    const newUser = await this.userService.create(createUserDto);

    const payload = {
      id: newUser.id,
      name: newUser.name,
      phone: newUser.phone,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signIn(id: string, password: string): Promise<any> {
    const user = await this.userService.findById(id);
    if (!user) throw new UnauthorizedException('존재하지 않는 사용자입니다.');

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');

    const payload = {
      id: user.id,
      name: user.name,
      phone: user.phone,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
