import { Response } from "express";
import { PaginationLinks, PaginationMeta } from "../types";

/**
 * Utility class to enforce a consistent JSON response structure
 * across the entire application interface.
 */
export class ApiResponse {
  /**
   * Sends a standardized formatted response.
   * If pagination (`links` and `meta`) is provided, format wraps the payload for pagination.
   * Otherwise, returns standard payload with message and data.
   */
  static send<T>(
    res: Response,
    data: T,
    message = "",
    statusCode: number = 200,
    links?: PaginationLinks,
    meta?: PaginationMeta,
  ): void {
    if (links && meta) {
      res.status(statusCode).json({
        success: true,
        data,
        links,
        meta,
      });
      return;
    }

    res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }
}
