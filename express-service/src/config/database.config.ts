import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import logger from "./logger.config";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME!,
  process.env.DB_USER!,
  process.env.DB_PASSWORD!,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: "mysql",
    logging:
      process.env.NODE_ENV === "development"
        ? (msg: string) => logger.debug(msg)
        : false,
  },
);

export const connectDB = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    logger.info("Database connected successfully.");
    await sequelize.sync();
    logger.info("Models synchronized.");
  } catch (error) {
    logger.error(`Unable to connect to the database: ${error}`);
    process.exit(1);
  }
};

export default sequelize;
