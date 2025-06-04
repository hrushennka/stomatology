import express from "express";
import * as serviceController from "../controllers/serviceController.js";

const router = express.Router();

router.get("/visits/:visitId", serviceController.getVisitDetails);
router.get("/services", serviceController.getAllServices);
router.get("/visitservices/:visitId", serviceController.getServicesByVisit);

router.post("/visits/services", serviceController.addServiceToVisit);

router.delete("/visits/services/:providedServiceId", serviceController.removeServiceFromVisit);

export default router;
