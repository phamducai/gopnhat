import { Knex } from "knex";
import dotenv from "dotenv";
dotenv.config();
interface IKnexConfig {
  [key: string]: Knex.Config;
}

const configs: IKnexConfig = {
  development: {
    client: process.env.DB_CLIENT,
    connection: {
      port: Number.parseInt(process.env.DB_PORT),
      host: process.env.DB_HOST,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    },
    pool: {
      min: 2,
      max: 10,
    }
  },
};

export default configs;