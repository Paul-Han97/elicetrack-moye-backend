import { DataSource } from 'typeorm';
import { config } from '../config';

const entityPath = config.server.runtime.environment === 'DEV' ? '**/entities/*.entity.ts' : '**/entities/*.entity.js';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: config.database.host,
  port: Number(config.database.port),
  username: config.database.username,
  password: config.database.password,
  database: config.database.name,
  entities: [entityPath],
  logging: true,
  synchronize: true,
});

export function dbConnect() {
  AppDataSource.initialize()
    .then(() => {
      console.log('AppDataSource 초기화 성공');
    })
    .catch((e) => {
      console.error(`AppDataSource 초기화 중 오류: ${e}`);
    });
}
