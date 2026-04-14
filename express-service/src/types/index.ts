export {};

declare global {
  namespace Express {
    export interface Request {
      userId?: string;
      userRole?: string;
      user?: import("../models/user.model").User;
    }
  }
}
