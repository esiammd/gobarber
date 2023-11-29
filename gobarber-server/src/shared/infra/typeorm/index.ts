import { DataSource } from 'typeorm';
import { postgresDatabase, mongoDatabase } from './ormconfig';

export const AppDataSource = new DataSource(postgresDatabase);

export const MongoDataSource = new DataSource(mongoDatabase);
