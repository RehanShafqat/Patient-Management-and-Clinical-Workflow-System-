import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../utils/api-response.util";
import { UserService } from "../services/user.service";
import { createUserSchema, updateUserSchema } from "../validations/user.validation";
import { AppError } from "../utils/app-error.util";
import { isValidUUID } from "../utils/uuid.util";

export class UserController {
  constructor(private userService: UserService = new UserService()) {}

  createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData = createUserSchema.parse(req.body);
      const user = await this.userService.createUser(userData);

      return ApiResponse.send(res, { user }, "User created successfully", 201);
    } catch (error) {
      return next(error);
    }
  };

  getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await this.userService.getAllUsers();

      return ApiResponse.send(res, { users }, "Users fetched successfully");
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
        return next(new AppError(400, "Invalid ID format"));
      }

      const user = await this.userService.getUserById(id);

      return ApiResponse.send(res, { user }, "User fetched successfully");
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
        return next(new AppError(400, "Invalid ID format"));
      }

      const updateData = updateUserSchema.parse(req.body);
      const user = await this.userService.updateUser(id, updateData);

      return ApiResponse.send(res, { user }, "User updated successfully");
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
        return next(new AppError(400, "Invalid ID format"));
      }

      await this.userService.deleteUser(id);

      return ApiResponse.send(res, null, "User deleted successfully");
    } catch (error) {
      return next(error);
    }
  };




  
}
