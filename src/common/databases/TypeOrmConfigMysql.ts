import { Injectable } from '@nestjs/common';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

@Injectable()
export class TypeOrmConfigMysql {
  type: 'mysql';
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  entities: EntityClassOrSchema[];
  timezone: string;
  synchronize: boolean;
  logging: boolean;
  namingStrategy: SnakeNamingStrategy;

  constructor(entities: EntityClassOrSchema[]) {
    this.type = 'mysql';
    this.host = process.env.DB_HOSTNAME;
    this.port = +process.env.DB_PORT;
    this.username = process.env.DB_USERNAME;
    this.password = process.env.DB_PASSWORD;
    this.database = process.env.DB_DATABASE;
    this.entities = [...entities];
    this.timezone = 'Asia/Seoul';
    this.synchronize = false;
    this.logging = false;
    this.namingStrategy = new SnakeNamingStrategy();
  }
}
