import z from "zod";
import { User } from "../models/user.model";
import { AppError } from "../utils/app-error.util";
import { createUserSchema, updateUserSchema } from "../validations/user.validation";
import { Role } from "../enums";
import { DoctorProfile, Permission, UserPermission } from "../models";
import sequelize from "../config/database.config";
import { Transaction } from "sequelize";

export class UserService {
  createUser = async (userData: z.infer<typeof createUserSchema>) => {
    const existingUser = await User.findOne({
      where: { email: userData.email }
    });
    if (existingUser) {
      throw new AppError(400, "User with this email already exists");
    }

    return await sequelize.transaction(async (t) => {
      const user = await User.create(userData, { transaction: t });
      return await this.handleRoleSpecificData(user, userData, t);
    });
  };

  getAllUsers = async () => {
    return User.findAll();
  };

  getUserById = async (id: string) => {
    const user = await User.findByPk(id);

    if (!user) {
      throw new AppError(404, "User not found");
    }

    return user;
  };

  updateUser = async (id: string, updateData: z.infer<typeof updateUserSchema>) => {
    return await sequelize.transaction(async (t) => {
      const user = await User.findByPk(id, { transaction: t });

      if (!user) {
        throw new AppError(404, "User not found");
      }
      if (updateData.email) {
        throw new AppError (400, "Email can not be updated");
      }
      // if (updateData.email) {
      //   const existingUser = await User.findOne({
      //     where: { email: updateData.email },
      //     transaction: t
      //   });

      //   if (existingUser && existingUser.id !== user.id) {
      //     throw new AppError(400, "Email already in use");
      //   }
      // }

      // To Check role changes logic
      if (updateData.role && updateData.role !== user.role) {
        if (updateData.role === Role.DOCTOR) {
          if (!updateData.specialty_id || !updateData.practice_location_id || !updateData.license_number) {
            throw new AppError(400, "Specialty, practice location, and license number are required when changing role to Doctor");
          }
        } else if (updateData.role === Role.FDO) {
          if (!updateData.permissions || updateData.permissions.length === 0) {
            throw new AppError(400, "Permissions are required when changing role to FDO");
          }
        }
      }

      await user.update(updateData, { transaction: t });

      return await this.handleRoleSpecificData(user, updateData, t);
    });
  };

  deleteUser = async (id: string) => {
    const user = await User.findByPk(id);

    if (!user) {
      throw new AppError(404, "User not found");
    }

    await user.destroy();
  };

  private handleRoleSpecificData = async (
    user: User,
    data: any, 
    transaction: Transaction
  ) => {
    let result: any = { ...user.toJSON() };
    const role = data.role;

    if (role === Role.FDO) {
      if (data.permissions) {
        // Destroying existing permissions on update
        await UserPermission.destroy({ where: { user_id: user.id }, transaction });

        const permissionRows = data.permissions.map((permission: string) => ({
          user_id: String(user.id),
          permission_id: permission
        }));
        await UserPermission.bulkCreate(permissionRows, { transaction });
        result.permissions = permissionRows;
      }
    } else if (role === Role.DOCTOR) {
      let doctorProfile = await DoctorProfile.findOne({ where: { user_id: user.id }, transaction });
      
      const allowedFields = ['specialty_id', 'practice_location_id', 'license_number', 'availability_schedule', 'bio'];
      const profileData: any = {};
      allowedFields.forEach(field => {
        if (data[field] !== undefined) profileData[field] = data[field];
      });

      if (doctorProfile) {
        if (Object.keys(profileData).length > 0) {
          await doctorProfile.update(profileData, { transaction });
        }
      } else {
        profileData.user_id = user.id;
        doctorProfile = await DoctorProfile.create(profileData, { transaction });
      }
      
      result.doctorProfile = doctorProfile;
    }

    return result;
  };
}
