import { Router } from "express";
import { checkAccessToken } from "../Middlewares/auth.middleware";
import { SpecialtyController } from "../Controllers/specialty.controller";

const specialtyRouter = Router();
const specialtyontroller = SpecialtyController;

specialtyRouter.get("/", checkAccessToken);
specialtyRouter.post("/", checkAccessToken);
specialtyRouter.get("/id", checkAccessToken);
specialtyRouter.put("/id", checkAccessToken);
specialtyRouter.delete("/id", checkAccessToken);

export default specialtyRouter;
