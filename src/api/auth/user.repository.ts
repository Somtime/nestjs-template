import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async findById(transactionManager: EntityManager, id: string): Promise<User> {
    return await transactionManager.findOne(User, {
      where: { id },
    });
  }

  async findByIdAndPassword(
    transactionManager: EntityManager,
    id: string,
    password: string,
  ): Promise<User> {
    return await transactionManager.findOne(User, {
      where: { id, password },
    });
  }
}
