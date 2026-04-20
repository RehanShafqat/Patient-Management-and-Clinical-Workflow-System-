import { Response } from "express";
import { env } from "../config/env.config";

/**
 * Attaches the JWT access token to an HTTP-only, secure cookie.
 * Prevents client-side JS access to mitigate XSS attacks.
 */
export const setAuthToken = (res: Response, accessToken: string) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });
};

/**
 * Clears the user's access token cookie to handle logout.
 */
export const clearAuthToken = (res: Response) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });
};
