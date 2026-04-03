import { Router } from "express";
// import { AuthController } from "../controllers/auth.controller";
// import { AuthService } from "../services/auth.service";
// import { checkAccessToken } from "../middlewares/auth.middleware";
const authRouter = Router();
// const authController = new AuthController(new AuthService());

// authRouter.post("/signup", authController.signUp);
// authRouter.post("/login", authController.login);
// authRouter.post("/logout", checkAccessToken, authController.logout);
// authRouter.get("/refresh-token", authController.refreshToken);
// authRouter.get("/me", checkAccessToken, authController.getMe);

export default authRouter;
