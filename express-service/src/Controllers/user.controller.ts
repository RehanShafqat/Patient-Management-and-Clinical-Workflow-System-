import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../utils/api-response.util";
import { UserService } from "../services/user.service";
import { createUserSchema, updateUserSchema } from "../validations/user.validation";
import { AppError } from "../utils/app-error.util";
import { isValidUUID } from "../utils/uuid.util";
import { HttpStatusCode, ResponseMessage } from "../enums";

export class UserController {
  constructor(private userService: UserService = new UserService()) {}

  createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData = createUserSchema.parse(req.body);
      const user = await this.userService.createUser(userData);

      return ApiResponse.send(res, { user }, ResponseMessage.USER_CREATED, HttpStatusCode.CREATED);
    } catch (error) {
      return next(error);
    }
  };

  getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await this.userService.getAllUsers();

      return ApiResponse.send(res, { users }, ResponseMessage.USERS_FETCHED);
    } catch (error) {
      return next(error);
    }
  };

  getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;

      if (!isValidUUID(id)) {
        return next(new AppError(HttpStatusCode.BAD_REQUEST, ResponseMessage.INVALID_ID_FORMAT));
      }

      const user = await this.userService.getUserById(id);

      return ApiResponse.send(res, { user }, ResponseMessage.USER_FETCHED);
    } catch (error) {
      return next(error);
    }
  };

  updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;

      if (!isValidUUID(id)) {
        return next(new AppError(HttpStatusCode.BAD_REQUEST, ResponseMessage.INVALID_ID_FORMAT));
      }

      const updateData = updateUserSchema.parse(req.body);
      const user = await this.userService.updateUser(id, updateData);

      return ApiResponse.send(res, { user }, ResponseMessage.USER_UPDATED);
    } catch (error) {
      return next(error);
    }
  };

  deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;

      if (!isValidUUID(id)) {
        return next(new AppError(HttpStatusCode.BAD_REQUEST, ResponseMessage.INVALID_ID_FORMAT));
      }

      await this.userService.deleteUser(id);

      return ApiResponse.send(res, null, ResponseMessage.USER_DELETED);
    } catch (error) {
      return next(error);
    }
  };
}
