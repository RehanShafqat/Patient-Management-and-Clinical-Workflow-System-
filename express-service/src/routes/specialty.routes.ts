import { Router } from "express";
// import { checkAccessToken } from "../Middlewares/auth.middleware";
import { SpecialtyController } from "../controllers/specialty.controller";

const specialtyRouter = Router();
const specialtyController = new SpecialtyController();

specialtyRouter.get(
  "/",
  // checkAccessToken,
  specialtyController.getAllSpecialties,
);
specialtyRouter.post(
  "/",
  // checkAccessToken,
  specialtyController.createSpecialty,
);
specialtyRouter.get(
  "/:id",
  // checkAccessToken,
  specialtyController.getSpecialtyById,
);
specialtyRouter.put(
  "/:id",
  // checkAccessToken,
  specialtyController.updateSpecialty,
);
specialtyRouter.delete(
  "/:id",
  // checkAccessToken,
  specialtyController.deleteSpecialty,
);

export default specialtyRouter;
