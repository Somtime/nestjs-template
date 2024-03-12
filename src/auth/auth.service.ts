import {
  Injectable,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MemberService } from 'src/member/member.service';
import * as bcrypt from 'bcrypt';
import { CreateMemberDto } from 'src/member/dto/create-member.dto';

@Injectable()
export class AuthService {
  constructor(
    private memberService: MemberService,
    private jwtService: JwtService,
  ) {}

  async signUp(createMemberDto: CreateMemberDto) {
    const findMember = await this.memberService.findById(createMemberDto.id);

    if (findMember) throw new ForbiddenException('이미 존재하는 사용자입니다.');
    const hashedPassword = await bcrypt.hash(createMemberDto.password, 12);
    createMemberDto.password = hashedPassword;

    const newMember = await this.memberService.create(createMemberDto);

    const payload = {
      id: newMember.id,
      name: newMember.name,
      phone: newMember.phone,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signIn(id: string, password: string): Promise<any> {
    const member = await this.memberService.findById(id);
    if (!member) throw new UnauthorizedException('존재하지 않는 사용자입니다.');

    const isMatch = await bcrypt.compare(password, member.password);

    if (!isMatch)
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');

    const payload = {
      id: member.id,
      name: member.name,
      phone: member.phone,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
