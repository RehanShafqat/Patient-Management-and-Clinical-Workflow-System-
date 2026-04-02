import { Router } from "express";
// import { expressProxy } from "../proxies/express.proxy";
import { laravelProxy } from "../proxies/laravel.proxy";

const caseRouter = Router();

caseRouter.use("/", laravelProxy);

export default caseRouter;
