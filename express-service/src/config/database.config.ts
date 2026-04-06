import { Sequelize } from "sequelize-typescript";
import logger from "./logger.config";
import dotenv from "dotenv";
dotenv.config();

import {
  User,
  DoctorProfile,
  Permission,
  UserPermission,
  Patient,
  PatientCase,
} from "../models/index";

const sequelize = new Sequelize(
  process.env.DB_NAME!,
  process.env.DB_USER!,
  process.env.DB_PASSWORD!,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: "mysql",
    models: [
      User,
      DoctorProfile,
      Patient,
      PatientCase,
      Permission,
      UserPermission,
    ],
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
    // No sync — Laravel owns all migrations
    logger.info("Models loaded successfully.");
  } catch (error) {
    logger.error(`Unable to connect to the database: ${error}`);
    process.exit(1);
  }
};

export default sequelize;
