import express from "express";
import * as contractController from "../controllers/contractController.js";

const router = express.Router();

router.get("/private", contractController.getPrivateContracts);
router.get("/organization", contractController.getOrgContracts);
router.delete("/private/:id", contractController.deletePrivateContract);
router.delete("/organization/:id", contractController.deleteOrgContract);

export default router;
