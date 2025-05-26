import express from "express";
import * as contractController from "../controllers/contractController.js";

const router = express.Router();

router.post("/contract", contactController.getContacts);
// router.get("/patients", patientsController.getPatients);
// router.post("/register", contactController.registerPatient);

// router.get("/activity/:patientId", doctorController.getActivity);
// router.put("/activity/:patientId", doctorController.putActivity);

export default router;
