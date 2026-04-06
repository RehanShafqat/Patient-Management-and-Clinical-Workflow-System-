import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/app-error.util";
import logger from "../config/logger.config";
import {
  UniqueConstraintError,
  ValidationError,
  ForeignKeyConstraintError,
  OptimisticLockError,
} from "sequelize";
import { ZodError } from "zod";
import { env } from "../config/env.config";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: err.success,
      message: err.message,
    });
    return;
  }

  if (err instanceof UniqueConstraintError) {
    const fields = err.errors.map((e) => e.path).join(", ");
    res.status(409).json({
      success: false,
      message: `${fields} already exists`,
    });
    return;
  }

  if (err instanceof ZodError) {
    console.log("hello");

    const message = err.issues.map((e) => e.message).join(", ");

    res.status(400).json({
      success: false,
      message,
    });
    return;
  }
  if (err instanceof ValidationError) {
    const messages = err.errors.map((e) => e.message).join(", ");
    res.status(400).json({
      success: false,
      message: messages,
    });
    return;
  }

  if (err instanceof ForeignKeyConstraintError) {
    res.status(400).json({
      success: false,
      message: "Referenced record does not exist",
    });
    return;
  }

  if (err instanceof OptimisticLockError) {
    res.status(400).json({
      success: false,
      message:
        "The requested resource to update has been updated by someone else please refresh and try again",
    });
  }

  logger.error(`Unexpected Error: ${err.message}\n${err.stack}`);

  res.status(500).json({
    success: false,
    message:
      env.NODE_ENV === "development" ? err.message : "Internal Server Error",
    ...(env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
