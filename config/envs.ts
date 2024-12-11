import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  DATABASE_HOST: string;
  DATABASE_PORT: number;
  DATABASE_USERNAME: string;
  DATABASE_PASSWORD: string;
  DATABASE_NAME: string;
  NATS_SERVERS: string[];
}

const envsSchema = joi
  .object({
    DATABASE_HOST: joi.string().required(),
    DATABASE_PORT: joi.number().required(),
    DATABASE_USERNAME: joi.string().required(),
    DATABASE_PASSWORD: joi.string().required(),
    DATABASE_NAME: joi.string().required(),
    NATS_SERVERS: joi.array().items(joi.string()).required(),
  })
  .unknown(true);

const { error, value } = envsSchema.validate({
  ...process.env,
  NATS_SERVERS: process.env.NATS_SERVERS?.split(','),
});

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
  database: {
    host: envVars.DATABASE_HOST,
    port: envVars.DATABASE_PORT,
    username: envVars.DATABASE_USERNAME,
    password: envVars.DATABASE_PASSWORD,
    name: envVars.DATABASE_NAME,
  },
  natsServers: envVars.NATS_SERVERS,
};
