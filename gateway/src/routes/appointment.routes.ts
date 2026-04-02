import { Router } from "express";
import { expressProxy } from "../proxies/express.proxy";

const appointmentRouter = Router();

appointmentRouter.use("/", expressProxy);

export default appointmentRouter;
