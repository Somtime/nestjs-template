import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { Member } from './entities/member.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member)
    private memberRepository: Repository<Member>,
  ) {}

  async create(createMemberDto: CreateMemberDto) {
    const newMember: Member = this.memberRepository.create(createMemberDto);
    return await this.memberRepository.save(newMember);
  }

  async findAll() {
    return await this.memberRepository.find();
  }

  async findById(id: string): Promise<Member> {
    return await this.memberRepository.findOne({
      where: { id },
    });
  }

  async findByIdAndPassword(id: string, password: string): Promise<Member> {
    return await this.memberRepository.findOne({
      where: { id, password },
    });
  }

  async update(idx: number, updateMemberDto: UpdateMemberDto) {
    return await this.memberRepository.update(idx, updateMemberDto);
  }

  async remove(idx: number) {
    return await this.memberRepository.delete(idx);
  }
}
