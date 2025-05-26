import express from "express";
import contractRouter from "./contractRouter.js";
import { handleUnexpectedError } from "../middlewares/handleUnexpectedError.js";

const router = express.Router();

router.use("/contract", contractRouter);

router.use(handleUnexpectedError);

export default router;
