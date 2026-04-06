import { NextFunction, Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { ApiResponse } from "../utils/api-response.util";
import { loginSchema } from "../validations";

export class AuthController {
  constructor(private authService: AuthService) {}

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      loginSchema.parse(req.body);
      const result = await this.authService.login(req.body);
      res.cookie("accessToken", result.accessToken, { httpOnly: true });
      ApiResponse.send(res, { user: result.user }, 200);
    } catch (error) {
      return next(error);
    }
  };
}
