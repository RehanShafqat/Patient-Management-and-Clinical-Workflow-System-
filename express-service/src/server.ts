import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { connectDB } from "./config/database.config";
import logger from "./config/logger.config";
import "./models";

const PORT = process.env.PORT;

const startServer = async (): Promise<void> => {
  await connectDB();

  app.listen(PORT, () => {
    logger.info(`Server running on http://localhost:${PORT}`);
    logger.info(`Environment: ${process.env.NODE_ENV || "development"}`);
  });
};

startServer();
