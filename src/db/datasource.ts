import { DataSource } from 'typeorm';
import config from '../config';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: config.database.host,
  port: Number(config.database.port),
  username: config.database.username,
  password: config.database.password,
  database: config.database.name,
  entities: ['**/entities/*.entity.js'],
  // entities: ['**/entities/*.entity.{js,ts}'],
  logging: true,
  synchronize: true,
});