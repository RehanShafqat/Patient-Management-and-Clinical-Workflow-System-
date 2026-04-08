import { Response } from "express";

export class ApiResponse {
  static send<T>(
    res: Response,
    data: T,
    message = "",
    statusCode: number = 200,
  ): void {
    res.status(statusCode).json({
      success: true,
      message: message,
      data,
    });
  }
}
