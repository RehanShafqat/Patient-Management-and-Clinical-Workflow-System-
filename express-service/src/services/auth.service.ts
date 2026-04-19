import type { SignOptions } from "jsonwebtoken";
import { z } from "zod";
import { env } from "../config/env.config";
import { HttpStatusCode, ResponseMessage, Role } from "../enums";
import { User, DoctorProfile, UserPermission, Permission } from "../models";
import { AppError } from "../utils/app-error.util";
import { createJwtToken } from "../utils/jwt.util";
import { comparePassword } from "../utils/bcrypt.util";
import { loginSchema } from "../validations";

export class AuthService {
  login = async (data: z.infer<typeof loginSchema>) => {
    const user = await User.scope("withPassword").findOne({
      where: { email: data.email.trim().toLowerCase() },
    });

    if (!user) throw new AppError(HttpStatusCode.UNAUTHORIZED, ResponseMessage.INVALID_CREDENTIALS);
    if (!user.is_active) throw new AppError(HttpStatusCode.FORBIDDEN, ResponseMessage.ACCOUNT_INACTIVE);
    if (!user.password) throw new AppError(HttpStatusCode.INTERNAL_SERVER_ERROR, ResponseMessage.PASSWORD_MISSING);

    const isPasswordMatched = await comparePassword(
      data.password,
      user.password,
    );
    if (!isPasswordMatched)
      throw new AppError(HttpStatusCode.UNAUTHORIZED, ResponseMessage.INVALID_CREDENTIALS);

    if (!Object.values(Role).includes(user.role as Role)) {
      throw new AppError(HttpStatusCode.FORBIDDEN, ResponseMessage.ROLE_NOT_ALLOWED);
    }

    const accessToken = createJwtToken(
      String(user.id),
      user.role,
      env.JWT_SECRET,
      String(env.JWT_EXPIRES_IN) as SignOptions["expiresIn"],
    );

    //INFO: Base payload it is same for all roles
    const basePayload = {
      accessToken,
      user: {
        id: String(user.id),
        role: user.role,
        first_name: user.first_name,
        last_name: user.last_name,
        created_at: user.created_at,
      },
    };

    //INFO: Role-specific additions
    if (user.role === Role.DOCTOR) {
      const profile = await DoctorProfile.findOne({
        where: { user_id: user.id },
      });
      return { ...basePayload, profile };
    }

    if (user.role === Role.FDO) {
      console.log("FDO Role");

      const userPermissions = await UserPermission.findAll({
        where: { user_id: user.id },
        include: [{ model: Permission, as: "permission", attributes: ["permission_name"] }],
      });

      const permissions = null;
      // = userPermissions.map(
      //   (up) => up.permission.permission_name,
      // );
      return { ...basePayload, permissions };
    }

    // Admin gets base only
    return basePayload;
  };

  getMe = async (userId: string) => {
    const user = await User.findByPk(userId);

    if (!user) throw new AppError(HttpStatusCode.NOT_FOUND, ResponseMessage.USER_NOT_FOUND);
    if (!user.is_active) throw new AppError(HttpStatusCode.FORBIDDEN, ResponseMessage.ACCOUNT_INACTIVE);

    return {
      id: String(user.id),
      role: user.role,
      first_name: user.first_name,
      last_name: user.last_name,
      created_at: user.created_at,
    };
  };
}
