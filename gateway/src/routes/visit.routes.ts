import { Router } from "express";
import { expressProxy } from "../proxies/express.proxy";

const visitRouter = Router();

visitRouter.use("/", expressProxy);

export default visitRouter;
