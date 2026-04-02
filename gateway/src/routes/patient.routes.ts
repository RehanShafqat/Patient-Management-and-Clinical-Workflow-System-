import { Router } from "express";
import { expressProxy } from "../proxies/express.proxy";

const patientRouter = Router();

patientRouter.use("/", expressProxy);

export default patientRouter;
