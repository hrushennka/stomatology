import express from "express";
import paymentController from "../controllers/paymentController.js";

const router = express.Router();

router.get("/list", paymentController.getPaymentsList);

router.post("/pay/:VisitID", paymentController.payVisit);

export default router;
