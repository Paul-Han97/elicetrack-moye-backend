import 'dotenv/config';

export const config = {
  server: {
    port: process.env.SERVER_PORT,
    runtime: {
      environment: process.env.SERVER_RUNTIME_ENVIRONMENT,
    },
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
  baseUrl: process.env.BASE_URL,
  email: {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    service: process.env.EMAIL_SERVICE,
    username: process.env.EMAIL_USERNAME,
    password: process.env.EMAIL_PASSWORD,
  },
};

checkConfiguration(config);

function checkConfiguration(data: object | undefined) {
  if (data === undefined) {
    throw new Error(`${data} 값이 할당되지 않았습니다.`);
  }

  for (const [key, value] of Object.entries(data)) {
    if (value instanceof Object) {
      checkConfiguration(value);
    }

    if (value === '' || value === undefined) {
      throw new Error(key + `값이 할당되지 않았습니다.`);
    }
  }
}
