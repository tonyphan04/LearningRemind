import { Router } from "express";
import { getTodayTasks, sendTodayReviewEmail } from "../controller/review.controller";

/**
 * @swagger
 * /api/reviews/today:
 *   get:
 *     summary: Get today's review tasks
 *     responses:
 *       200:
 *         description: List of review tasks due today
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ReviewTask'
 */
/**
 * @swagger
 * /api/reviews/today/email:
 *   get:
 *     summary: Send today's review tasks via email
 *     responses:
 *       200:
 *         description: Email sent
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sent:
 *                   type: boolean
 *                 count:
 *                   type: integer
 */

const router = Router();
router.get("/today", getTodayTasks);
router.get("/today/email", sendTodayReviewEmail);

export default router;
