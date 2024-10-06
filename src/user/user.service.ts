import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const newUser: User = this.userRepository.create(createUserDto);
    return await this.userRepository.save(newUser);
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findById(id: string): Promise<User> {
    return await this.userRepository.findOne({
      where: { id },
    });
  }

  async findByIdAndPassword(id: string, password: string): Promise<User> {
    return await this.userRepository.findOne({
      where: { id, password },
    });
  }

  async update(idx: number, updateUserDto: UpdateUserDto) {
    return await this.userRepository.update(idx, updateUserDto);
  }

  async remove(idx: number) {
    return await this.userRepository.delete(idx);
  }
}
