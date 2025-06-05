import express from "express";
import appointmentController from "../controllers/appointmentController.js";

const router = express.Router();

router.get("/list", appointmentController.getVisitList);
router.post("/visits", appointmentController.addVisit);   
router.delete("/visits/:id", appointmentController.deleteVisit);
router.get("/doctors", appointmentController.getDoctors);
router.get("/patients", appointmentController.getPatients);

export default router;