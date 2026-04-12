import { Router } from "express";
import authRoutes from "./auth.routes";
import patientRoutes from "./patient.routes";
import caseRoutes from "./case.routes";
import userRoutes from "./user.routes";
const router = Router();

// router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/patients", patientRoutes);
router.use("/cases", caseRoutes);
router.use("/users", userRoutes);

export default router;
