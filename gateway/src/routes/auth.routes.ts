import { Router } from "express";
// import { laravelProxy } from "../proxies/laravel.proxy";
import { expressProxy } from "../proxies/express.proxy";

const authRouter = Router();

authRouter.use("/", expressProxy);

export default authRouter;
