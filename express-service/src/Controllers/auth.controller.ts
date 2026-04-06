import { NextFunction, Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { ApiResponse } from "../utils/api-response.util";
import { loginSchema } from "../validations";

export class AuthController {
  constructor(private authService: AuthService) {}

  login = (req: Request, res: Response, next: NextFunction) => {
    try {
      loginSchema.parse(req.body);
      const result = this.authService.login(req.body);
      ApiResponse.send(res, result, 200);
    } catch (error) {
      return next(error);
    }
  };
}
