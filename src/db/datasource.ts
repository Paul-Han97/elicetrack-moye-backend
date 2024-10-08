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
  logging: true,
  synchronize: true,
});

AppDataSource.initialize()
  .then(() => {
    console.log('AppDataSource 초기화');
  })
  .catch((e) => {
    console.error(`AppDataSource 초기화 중 오류: ${e}`);
  });
