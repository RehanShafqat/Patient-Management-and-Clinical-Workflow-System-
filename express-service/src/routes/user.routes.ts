import { Router } from "express";
import { UserController } from "../Controllers/user.controller";
import { checkAccessToken } from "../Middlewares/auth.middleware";

const userRouter = Router();
const userController = new UserController();

userRouter.post("/", userController.createUser);

userRouter.get("/", userController.getAllUsers);

userRouter.get("/:id", userController.getUserById);

userRouter.put("/:id", userController.updateUser);

userRouter.delete("/:id", userController.deleteUser);

export default userRouter;
