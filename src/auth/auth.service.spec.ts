import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { jwtConstants } from './constants';
import { faker } from '@faker-js/faker';
import { UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, QueryRunner } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from './entities/user.entity';
import { TypeOrmConfig } from 'typeorm.config';

describe('AuthService', () => {
  let service: AuthService;
  let dataSource: DataSource;
  let queryRunner: QueryRunner;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          cache: true,
          isGlobal: true,
        }),
        TypeOrmModule.forRoot(new TypeOrmConfig([User])),
        JwtModule.register({
          global: true,
          secret: jwtConstants.secret,
          signOptions: { expiresIn: '60s' },
        }),
      ],
      providers: [AuthService, UserRepository, User],
    }).compile();

    service = module.get<AuthService>(AuthService);
    dataSource = module.get<DataSource>(DataSource);
    queryRunner = dataSource.createQueryRunner();
    queryRunner.connect();
    queryRunner.startTransaction();
  });

  afterAll(async () => {
    await queryRunner.rollbackTransaction();
    await queryRunner.release();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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
      const jwtToken = await service.signUp(queryRunner.manager, signUpUser);

      const createdUser = new JwtService().decode(jwtToken.access_token);

      expect(createdUser.id).toEqual(signUpUser.id);
      expect(createdUser.name).toEqual(signUpUser.name);
      expect(createdUser.phone).toEqual(signUpUser.phone);
    });

    it('signUp() Duplication User', async () => {
      const signUpUser = new CreateUserDto();
      signUpUser.id = id;
      signUpUser.password = password;
      signUpUser.name = faker.internet.userName();
      signUpUser.phone = faker.phone.number();

      await expect(
        async () => await service.signUp(queryRunner.manager, signUpUser),
      ).rejects.toThrow(
        new UnauthorizedException('이미 존재하는 사용자입니다.'),
      );
    });

    it('signIn()', async () => {
      const signUpUser = new CreateUserDto();
      signUpUser.id = id;
      signUpUser.password = password;
      signUpUser.phone = faker.phone.number();

      const signInUser = await service.signIn(
        queryRunner.manager,
        id,
        password,
      );
      const token = new JwtService().decode(signInUser.access_token);

      expect(token.id).toBe(id);
    });

    it('signIn() Not Exist User', async () => {
      await expect(
        async () =>
          await service.signIn(
            queryRunner.manager,
            faker.string.uuid(),
            faker.internet.password(),
          ),
      ).rejects.toThrow(
        new UnauthorizedException('존재하지 않는 사용자입니다.'),
      );
    });

    it('signIn() Not Equal Password', async () => {
      await expect(
        async () =>
          await service.signIn(
            queryRunner.manager,
            id,
            faker.internet.password(),
          ),
      ).rejects.toThrow(
        new UnauthorizedException('비밀번호가 일치하지 않습니다.'),
      );
    });
  });
});
