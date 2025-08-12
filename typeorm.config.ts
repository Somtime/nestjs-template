import { Injectable } from '@nestjs/common';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

@Injectable()
export class TypeOrmConfig {
  type: 'mysql';
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  entities: string[];
  timezone: string;
  synchronize: boolean;
  logging: boolean;
  namingStrategy: SnakeNamingStrategy;

  constructor(entities: any[] = ['dist/**/*.entity{.ts,.js}']) {
    this.type = 'mysql';
    this.host = process.env.DB_HOSTNAME;
    this.port = +process.env.DB_PORT;
    this.username = process.env.DB_USERNAME;
    this.password = process.env.DB_PASSWORD;
    this.database = process.env.DB_DATABASE;
    this.entities = entities;
    this.timezone = 'Asia/Seoul';
    this.synchronize = false;
    this.logging = false;
    this.namingStrategy = new SnakeNamingStrategy();
  }
}
