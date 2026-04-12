import { NextFunction, Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { ApiResponse } from "../utils/api-response.util";
import { AppError } from "../utils/app-error.util";
import { loginSchema } from "../validations";
export class AuthController {
  constructor(private authService: AuthService) {}

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      loginSchema.parse(req.body);
      const result = await this.authService.login(req.body);
      res.cookie("accessToken", result.accessToken, { httpOnly: true });
      ApiResponse.send(res, { user: result.user }, "Login successful", 200);
    } catch (error) {
      return next(error);
    }
  };

  getMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.userId) return next(new AppError(401, "Unauthorized"));

      const user = await this.authService.getMe(req.userId);
      ApiResponse.send(res, { user }, "", 200);
    } catch (error) {
      return next(error);
    }
  };
}
