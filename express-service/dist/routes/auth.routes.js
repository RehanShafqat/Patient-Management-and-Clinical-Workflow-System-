"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const auth_service_1 = require("../services/auth.service");
const authRouter = (0, express_1.Router)();
const authController = new auth_controller_1.AuthController(new auth_service_1.AuthService());
authRouter.post("/login", authController.login);
authRouter.post("/logout", auth_middleware_1.checkAccessToken, authController.logout);
// authRouter.get("/refresh-token", authController.refreshToken);
authRouter.get("/me", auth_middleware_1.checkAccessToken, authController.getMe);
exports.default = authRouter;
//# sourceMappingURL=auth.routes.js.map