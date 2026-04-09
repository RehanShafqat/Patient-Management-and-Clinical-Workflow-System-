import { Router } from "express";
import authRoutes from "./auth.routes";
import patientRoutes from "./patient.routes";
import caseRoutes from "./case.routes";
const router = Router();

// router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/patients", patientRoutes);
router.use("/cases", caseRoutes);

export default router;
