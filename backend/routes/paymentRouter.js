import express from "express";
import paymentController from "../controllers/paymentController.js";

const router = express.Router();

// Получить список визитов с услугами и инфой по оплатам
router.get("/list", paymentController.getPaymentsList);

// Оплатить визит (по ID визита)
router.post("/pay/:VisitID", paymentController.payVisit);

export default router;
