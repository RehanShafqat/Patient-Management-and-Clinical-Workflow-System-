import { Request, Response, NextFunction } from "express";
import { User } from "../models/user.model";
import {
  createUserSchema,
  updateUserSchema,
} from "../validations/user.validation";
import { ApiResponse } from "../utils/api-response.util";
import { AppError } from "../utils/app-error.util";

export class UserController {
  createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData = createUserSchema.parse(req.body);

      const existingUser = await User.findOne({
        where: { email: userData.email },
      });

      if (existingUser) {
        return next(new AppError(400, "Email already exists"));
      }

      const user = await User.create(userData);

      return ApiResponse.send(res, { user }, "User created successfully", 201);
    } catch (error) {
      return next(error);
    }
  };

  getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await User.findAll();

      return ApiResponse.send(res, { users }, "Users fetched successfully");
    } catch (error) {
      return next(error);
    }
  };

  getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      if (isNaN(Number(id))) {
        return next(new AppError(400, "Invalid ID format"));
      }

      const user = await User.findByPk(Number(id));

      if (!user) {
        return next(new AppError(404, "User not found"));
      }

      return ApiResponse.send(res, { user }, "User fetched successfully");
    } catch (error) {
      return next(error);
    }
  };

  updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      if (isNaN(Number(id))) {
        return next(new AppError(400, "Invalid ID format"));
      }

      const user = await User.findByPk(Number(id));

      if (!user) {
        return next(new AppError(404, "User not found"));
      }

      const updateData = updateUserSchema.parse(req.body);

      // Prevent email duplication
      if (updateData.email) {
        const existingUser = await User.findOne({
          where: { email: updateData.email },
        });

        if (existingUser && existingUser.id !== user.id) {
          return next(new AppError(400, "Email already in use"));
        }
      }

      await user.update(updateData);

      return ApiResponse.send(res, { user }, "User updated successfully");
    } catch (error) {
      return next(error);
    }
  };

  deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      if (isNaN(Number(id))) {
        return next(new AppError(400, "Invalid ID format"));
      }

      const user = await User.findByPk(Number(id));

      if (!user) {
        return next(new AppError(404, "User not found"));
      }

      await user.destroy();

      return ApiResponse.send(res, null, "User deleted successfully");
    } catch (error) {
      return next(error);
    }
  };
}
