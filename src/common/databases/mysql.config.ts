import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export const TypeOrmMysqlConfig = (entities: any[]) =>
  TypeOrmModule.forRoot({
    type: 'mysql',
    host: process.env.DB_HOSTNAME,
    port: +process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [...entities],
    timezone: 'Asian/Seoul',
    synchronize: false,
    logging: false,
    namingStrategy: new SnakeNamingStrategy(),
  });
