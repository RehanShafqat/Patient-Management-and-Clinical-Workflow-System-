import { NextFunction, Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { ApiResponse } from "../utils/api-response.util";
import { AppError } from "../utils/app-error.util";
import { loginSchema } from "../validations";
import { HttpStatusCode, ResponseMessage } from "../enums";
import { clearAuthToken, setAuthToken } from "../utils/cookie.util";

/**
 * Controller responsible for handling authentication flows.
 * Handles login, user profile retrieval, and logout functionalities.
 */
export class AuthController {
  constructor(private authService: AuthService) { }

  /**
   * Authenticates a user by validating their credentials.
   * If successful, sets an HTTP-only access token cookie and returns the user object.
   */
  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      loginSchema.parse(req.body);
      const result = await this.authService.login(req.body);
      setAuthToken(res, result.accessToken);

      ApiResponse.send(
        res,
        { user: result.user },
        ResponseMessage.LOGIN_SUCCESS,
        HttpStatusCode.OK,
      );
    } catch (error) {
      return next(error);
    }
  };

  /**
   * Retrieves the currently authenticated user's profile based on the attached `userId`.
   * Requires `checkAccessToken` middleware to have run beforehand.
   */
  getMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.userId)
        return next(
          new AppError(
            HttpStatusCode.UNAUTHORIZED,
            ResponseMessage.UNAUTHORIZED,
          ),
        );

      const user = await this.authService.getMe(req.userId);
      ApiResponse.send(
        res,
        { user },
        ResponseMessage.USER_FETCHED,
        HttpStatusCode.OK,
      );
    } catch (error) {
      return next(error);
    }
  };

  /**
   * Logs out the user by clearing their HTTP-only access token cookie.
   */
  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      clearAuthToken(res);
      ApiResponse.send(
        res,
        null,  // "data": null
        ResponseMessage.LOGOUT_SUCCESS,
        HttpStatusCode.OK,
      );
    } catch (error) {
      return next(error);
    }
  };
}
