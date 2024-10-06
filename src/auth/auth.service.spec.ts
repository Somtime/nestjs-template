import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User } from 'src/user/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { jwtConstants } from './constants';
import { faker } from '@faker-js/faker';
import { UnauthorizedException } from '@nestjs/common';
import { TypeOrmMysqlConfig } from 'src/common/databases/mysql.config';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          cache: true,
          isGlobal: true,
        }),
        TypeOrmMysqlConfig([User]),
        TypeOrmModule.forFeature([User]),
        UserModule,
        JwtModule.register({
          global: true,
          secret: jwtConstants.secret,
          signOptions: { expiresIn: '60s' },
        }),
      ],
      providers: [AuthService, UserService],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(userService).toBeDefined();
  });

  describe('회원가입/로그인', () => {
    const id = faker.string.uuid();
    const password = faker.internet.password();

    it('signUp()', async () => {
      const signUpUser = new CreateUserDto();
      signUpUser.id = id;
      signUpUser.password = password;
      signUpUser.name = faker.internet.userName();
      signUpUser.phone = faker.phone.number();
      const jwtToken = await service.signUp(signUpUser);

      const newUser = new JwtService().decode(jwtToken.access_token);
      const findUser = await userService.findById(newUser.id);

      expect(findUser.id).toEqual(signUpUser.id);
      expect(findUser.name).toEqual(signUpUser.name);
      expect(findUser.phone).toEqual(signUpUser.phone);
    });

    it('signUp() Duplication User', async () => {
      const signUpUser = new CreateUserDto();
      signUpUser.id = id;
      signUpUser.password = password;
      signUpUser.name = faker.internet.userName();
      signUpUser.phone = faker.phone.number();

      await expect(
        async () => await service.signUp(signUpUser),
      ).rejects.toThrow(
        new UnauthorizedException('이미 존재하는 사용자입니다.'),
      );
    });

    it('signIn()', async () => {
      const signUpUser = new CreateUserDto();
      signUpUser.id = id;
      signUpUser.password = password;
      signUpUser.phone = faker.phone.number();

      const signInUser = await service.signIn(id, password);
      const token = new JwtService().decode(signInUser.access_token);

      expect(token.id).toBe(id);
    });

    it('signIn() Not Exist User', async () => {
      await expect(
        async () =>
          await service.signIn(faker.string.uuid(), faker.internet.password()),
      ).rejects.toThrow(
        new UnauthorizedException('존재하지 않는 사용자입니다.'),
      );
    });

    it('signIn() Not Equal Password', async () => {
      await expect(
        async () => await service.signIn(id, faker.internet.password()),
      ).rejects.toThrow(
        new UnauthorizedException('비밀번호가 일치하지 않습니다.'),
      );
    });
  });
});
