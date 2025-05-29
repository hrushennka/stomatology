import express from "express";
import * as contractController from "../controllers/contractController.js";

const router = express.Router();

/**
 * @swagger
 * /api/contract:
 *   get:
 *     summary: Получить все договора
 *     tags: [Contracts]
 *     responses:
 *       200:
 *         description: Возвращает список всех договоров
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   number:
 *                     type: string
 *                   clientName:
 *                     type: string
 *                   organizationName:
 *                     type: string
 *                   type:
 *                     type: string
 *       500:
 *         description: Ошибка получения договоров
 */

router.get("/", contractController.getContracts);

export default router;
