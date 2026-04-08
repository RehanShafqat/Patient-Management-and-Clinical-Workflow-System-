import type { NextFunction, Request, Response } from "express";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  // const publicPaths = ["/health", "/api/auth/signup", "/api/auth/login"];

  // if (publicPaths.includes(req.path)) {
  //   next();
  //   return;
  // }

  // const authHeader = req.headers.authorization;

  // if (!authHeader) {
  //   res.status(401).json({ success: false, message: "Unauthorized" });
  //   return;
  // }

  next();
};
