import cors from "cors";
import express from "express";
import { authMiddleware } from "./middlewares/auth.middleware";
import { loggerMiddleware } from "./middlewares/logger.middleware";
import appointmentRouter from "./routes/appointment.routes";
import authRouter from "./routes/auth.routes";
import caseRouter from "./routes/case.routes";
import patientRouter from "./routes/patient.routes";
import visitRouter from "./routes/visit.routes";

const app = express();

app.use(cors());
app.use(express.json());
app.use(loggerMiddleware);

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/auth", authRouter);
app.use("/api/patients", authMiddleware, patientRouter);
app.use("/api/cases", authMiddleware, caseRouter);
app.use("/api/appointments", authMiddleware, appointmentRouter);
app.use("/api/visits", authMiddleware, visitRouter);

export default app;
