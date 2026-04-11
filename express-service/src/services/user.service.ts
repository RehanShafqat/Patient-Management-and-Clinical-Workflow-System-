import z from "zod";
import { User } from "../models/user.model";
import { AppError } from "../utils/app-error.util";
import { createUserSchema } from "../validations/user.validation";
import { Role } from "../enums";
import { Permission, UserPermission } from "../models";
import sequelize from "../config/database.config";
// type CreateUserInput = {
//   email: string;
// } & Record<string, unknown>;

// type UpdateUserInput = {
//   email?: string;
// } & Record<string, unknown>;

export class UserService {
  createUser = async (userData: z.infer<typeof createUserSchema>) => {
    return {};
  };

  getAllUsers = async () => {
    return User.findAll();
  };

  getUserById = async (id: string) => {
    const user = await User.findByPk(Number(id));

    if (!user) {
      throw new AppError(404, "User not found");
    }

    return user;
  };

  updateUser = async (
    id: string,
    updateData: z.infer<typeof createUserSchema>,
  ) => {
    const user = await User.findByPk(Number(id));

    if (!user) {
      throw new AppError(404, "User not found");
    }

    if (updateData.email) {
      const existingUser = await User.findOne({
        where: { email: updateData.email },
      });

      if (existingUser && existingUser.id !== user.id) {
        throw new AppError(400, "Email already in use");
      }
    }

    await user.update(updateData);

    return user;
  };

  deleteUser = async (id: string) => {
    const user = await User.findByPk(Number(id));

    if (!user) {
      throw new AppError(404, "User not found");
    }

    await user.destroy();
  };
}
