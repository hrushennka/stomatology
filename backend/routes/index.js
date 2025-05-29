import express from "express";
import contractRouter from "./contractRouter.js";
import paymentRouter from "./paymentRouter.js";
import serviceRouter from "./serviceRouter.js";
import appointmentRouter from "./appointmentRouter.js";

import { handleUnexpectedError } from "../middlewares/handleUnexpectedError.js";

const router = express.Router();

router.use("/contract", contractRouter);
router.use("/payment", paymentRouter);
router.use("/service", serviceRouter);
router.use("/appointment", appointmentRouter);

router.use(handleUnexpectedError);

export default router;
