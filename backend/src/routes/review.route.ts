import { Router } from "express";
import { getTodayTasks, sendTodayReviewEmail } from "../controller/review.controller";

/**
 * @swagger
 * components:
 *   schemas:
 *     LearningItemResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         topic:
 *           type: string
 *         goal:
 *           type: array
 *           items:
 *             type: string
 *         resources:
 *           type: array
 *           items:
 *             type: string
 *         startDay:
 *           type: string
 *           format: date-time
 *         createdAt:
 *           type: string
 *           format: date-time
 *         reviews:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               intervalDay:
 *                 type: integer
 *               itemId:
 *                 type: integer
 * /api/reviews/today:
 *   get:
 *     summary: Get today's review items
 *     responses:
 *       200:
 *         description: List of today's review items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/LearningItemResponse'
 */
/**
 * @swagger
 * /api/reviews/today/email:
 *   get:
 *     summary: Send today's review items via email
 *     responses:
 *       200:
 *         description: Email sent with today's review items
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
