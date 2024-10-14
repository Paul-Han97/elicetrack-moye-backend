import 'dotenv/config';

export default {
  server: {
    port: process.env.SERVER_PORT || new Error(),
  },
  database: {
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    name: process.env.DATABASE_NAME,
  },
  jwt: {
    key: process.env.JWT_KEY,
  },
};
