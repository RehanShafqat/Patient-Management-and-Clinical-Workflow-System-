import { Response } from "express";

export class ApiResponse {
  static send<T>(res: Response, data: T, statusCode: number = 200): void {
    res.status(statusCode).json({
      success: true,
      data,
    });
  }
}
