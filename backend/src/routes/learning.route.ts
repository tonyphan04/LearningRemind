import { Router } from "express";
import {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote
} from "../controller/learning.controller";

const router = Router();

/**
 * @swagger
 * /api/notes:
 *   get:
 *     summary: Get all learning notes
 *     responses:
 *       200:
 *         description: List of notes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/LearningItem'
 */
/**
 * @swagger
 * /api/notes:
 *   post:
 *     summary: Create a new learning note
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LearningItem'
 *     responses:
 *       201:
 *         description: Created note
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LearningItem'
 */
/**
 * @swagger
 * /api/notes/{id}:
 *   get:
 *     summary: Get a learning note by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The note
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LearningItem'
 *       404:
 *         description: Note not found
 */
/**
 * @swagger
 * /api/notes/{id}:
 *   put:
 *     summary: Update a learning note
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LearningItem'
 *     responses:
 *       200:
 *         description: Updated note
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LearningItem'
 *       404:
 *         description: Note not found
 */
/**
 * @swagger
 * /api/notes/{id}:
 *   delete:
 *     summary: Delete a learning note
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Note deleted
 *       404:
 *         description: Note not found
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     LearningItem:
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
 *             $ref: '#/components/schemas/ReviewTask'
 *     ReviewTask:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         intervalDay:
 *           type: integer
 *         itemId:
 *           type: integer
 */

router.post("/", createNote);
router.get("/", getNotes);
router.get("/:id", getNoteById);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);

export default router;
