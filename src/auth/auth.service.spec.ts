import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { MemberService } from 'src/member/member.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { CreateMemberDto } from 'src/member/dto/create-member.dto';
import { Member } from 'src/member/entities/member.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberModule } from 'src/member/member.module';
import { ConfigModule } from '@nestjs/config';
import { jwtConstants } from './constants';
import { faker } from '@faker-js/faker';
import { UnauthorizedException } from '@nestjs/common';
import { TypeOrmMysqlConfig } from 'src/common/databases/mysql.config';

describe('AuthService', () => {
  let service: AuthService;
  let memberService: MemberService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          cache: true,
          isGlobal: true,
        }),
        TypeOrmMysqlConfig([Member]),
        TypeOrmModule.forFeature([Member]),
        MemberModule,
        JwtModule.register({
          global: true,
          secret: jwtConstants.secret,
          signOptions: { expiresIn: '60s' },
        }),
      ],
      providers: [AuthService, MemberService],
    }).compile();

    service = module.get<AuthService>(AuthService);
    memberService = module.get<MemberService>(MemberService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(memberService).toBeDefined();
  });

  describe('회원가입/로그인', () => {
    const id = faker.string.uuid();
    const password = faker.internet.password();

    it('signUp()', async () => {
      const signUpMember = new CreateMemberDto();
      signUpMember.id = id;
      signUpMember.password = password;
      signUpMember.name = faker.internet.userName();
      signUpMember.phone = faker.phone.number();
      const jwtToken = await service.signUp(signUpMember);

      const newMember = new JwtService().decode(jwtToken.access_token);
      const findMember = await memberService.findById(newMember.id);

      expect(findMember.id).toEqual(signUpMember.id);
      expect(findMember.name).toEqual(signUpMember.name);
      expect(findMember.phone).toEqual(signUpMember.phone);
    });

    it('signUp() Duplication User', async () => {
      const signUpMember = new CreateMemberDto();
      signUpMember.id = id;
      signUpMember.password = password;
      signUpMember.name = faker.internet.userName();
      signUpMember.phone = faker.phone.number();

      await expect(
        async () => await service.signUp(signUpMember),
      ).rejects.toThrow(
        new UnauthorizedException('이미 존재하는 사용자입니다.'),
      );
    });

    it('signIn()', async () => {
      const signUpMember = new CreateMemberDto();
      signUpMember.id = id;
      signUpMember.password = password;
      signUpMember.phone = faker.phone.number();

      const signInMember = await service.signIn(id, password);
      const token = new JwtService().decode(signInMember.access_token);

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
