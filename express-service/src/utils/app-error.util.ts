export class AppError extends Error {
  public readonly statusCode: number;
  public readonly success: boolean;
  public readonly isOperational: boolean;

  constructor(statusCode: number, message: string) {
    super(message);

    this.statusCode = statusCode;
    this.success = statusCode >= 400 && statusCode < 500 ? false : true;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
