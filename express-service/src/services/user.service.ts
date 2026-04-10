import z from "zod";
import { User } from "../models/user.model";
import { AppError } from "../utils/app-error.util";
import { createUserSchema } from "../validations/user.validation";
import { UserRole } from "../enums/userRole.enum";
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
    const existingUser = await User.findOne({
      where: { email: userData.email },
    });

    if (existingUser) {
      throw new AppError(400, "Email already exists");
    }

    return sequelize.transaction(async (t) => {
      const createdUser = await User.create(userData, { transaction: t });

      if (userData.role === UserRole.DOCTOR) {
        // TODO: make create User here
      } else if (userData.role === UserRole.FDO) {
        const validPermissions = await Permission.findAll({
          where: { id: userData.permissions },
          transaction: t,
        });

        if (validPermissions.length !== userData.permissions.length) {
          throw new AppError(400, "One or more permissions are invalid");
        }

        await UserPermission.bulkCreate(
          userData.permissions.map((permId) => ({
            user_id: createdUser.id,
            permission_id: permId,
          })),
          { transaction: t },
        );
      }

      return createdUser;
    });
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
