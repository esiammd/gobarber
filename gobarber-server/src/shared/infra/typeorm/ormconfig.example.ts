import { type DataSourceOptions } from 'typeorm';

export const postgresDatabase: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'docker',
  database: 'gobarber',
  entities: ['./src/modules/**/infra/typeorm/entities/*.ts'],
  migrations: ['./src/shared/infra/typeorm/migrations/*.ts'],
};

export const mongoDatabase: DataSourceOptions = {
  type: 'mongodb',
  host: 'localhost',
  port: 27017,
  database: 'gobarber',
  entities: ['./src/modules/**/infra/typeorm/schemas/*.ts'],
};
