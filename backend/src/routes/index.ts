/**
 * @swagger
 * /api/{any}:
 *   get:
 *     summary: Swagger UI and OpenAPI docs
 *     description: Access the Swagger UI and OpenAPI JSON for API documentation and testing. The docs are available at /api/docs (UI) and /api/docs.json (raw spec).
 *     tags: [API]
 *     responses:
 *       200:
 *         description: Swagger UI or OpenAPI JSON served
 */
import { Router } from "express";
import * as auth from "../controller/auth.controller";
import * as folder from "../controller/folder.controller";
import * as vocab from "../controller/vocab.controller";
import * as review from "../controller/review.controller";
import { upload } from "../middleware/upload";

const router = Router();


/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * tags:
 *   - name: Auth
 *     description: User authentication
 *   - name: Folders
 *     description: Folder (Collection) management
 *   - name: Vocabs
 *     description: Vocabulary (Word) management
 *   - name: Review
 *     description: Spaced repetition review endpoints
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Validation error
 *       401:
 *         description: Invalid credentials
 */
// Auth
router.post("/auth/login", auth.login);

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: User registration
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       201:
 *         description: User created
 *       400:
 *         description: Validation error
 *       409:
 *         description: User already exists
 */
router.post("/auth/signup", auth.signup);

/**
 * @swagger
 * /api/auth/change-password:
 *   post:
 *     summary: Change user password
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 example: oldpass123
 *               newPassword:
 *                 type: string
 *                 example: newpass456
 *     responses:
 *       200:
 *         description: Password changed
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post("/auth/change-password", auth.changePassword);
//router.get("/auth/me", auth.getCurrentUser);

/**
 * @swagger
 * /api/folders:
 *   post:
 *     summary: Create a new folder (collection)
 *     tags: [Folders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: My Collection
 *               description:
 *                 type: string
 *                 example: Words for travel
 *     responses:
 *       201:
 *         description: Folder created
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *   get:
 *     summary: Get all folders for the logged-in user
 *     tags: [Folders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of folders
 *       401:
 *         description: Unauthorized
 */
router.post("/folders", folder.createFolder);
router.get("/folders", folder.getFolders);

/**
 * @swagger
 * /api/folders/{id}:
 *   get:
 *     summary: Get a folder by ID
 *     tags: [Folders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Folder ID
 *     responses:
 *       200:
 *         description: Folder found
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Folder not found
 *   put:
 *     summary: Update a folder by ID
 *     tags: [Folders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Folder ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated Collection
 *               description:
 *                 type: string
 *                 example: Updated description
 *     responses:
 *       200:
 *         description: Folder updated
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Folder not found or not yours
 *   delete:
 *     summary: Delete a folder by ID
 *     tags: [Folders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Folder ID
 *     responses:
 *       200:
 *         description: Folder deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Folder not found or not yours
 */
router.get("/folders/:id", folder.getFolderById);
router.put("/folders/:id", folder.updateFolder);
router.delete("/folders/:id", folder.deleteFolder);

/**
 * @swagger
 * /api/folders/search:
 *   get:
 *     summary: Search folders by name (partial, case-insensitive)
 *     tags: [Folders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: Name to search for
 *     responses:
 *       200:
 *         description: List of matching folders
 *       400:
 *         description: Name query is required
 *       401:
 *         description: Unauthorized
 */
router.get("/folders/search", folder.getFolderByName);

/**
 * @swagger
 * /api/vocabs:
 *   post:
 *     summary: Create a new vocab (word)
 *     tags: [Vocabs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - collectionId
 *               - word
 *             properties:
 *               collectionId:
 *                 type: integer
 *                 example: 1
 *               word:
 *                 type: string
 *                 example: apple
 *               description:
 *                 type: string
 *                 example: A fruit
 *               example:
 *                 type: string
 *                 example: I eat an apple every day.
 *     responses:
 *       201:
 *         description: Vocab created
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *   get:
 *     summary: Get all vocabs in a collection
 *     tags: [Vocabs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: collectionId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Collection ID
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [word, createdAt, updatedAt]
 *         required: false
 *         description: Sort by field
 *     responses:
 *       200:
 *         description: List of vocabs
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post("/vocabs", vocab.createVocab);
/**
 * @swagger
 * /api/vocabs/file/{collectionId}:
 *   post:
 *     summary: Upload a file to import vocabs into a collection
 *     tags: [Vocabs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: collectionId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Collection ID to import vocabs into
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The file to upload (.csv, .txt, .xlsx, .pdf, .docx)
 *     responses:
 *       200:
 *         description: File uploaded and vocabs imported
 *       400:
 *         description: Validation error or file error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Collection not found or not yours
 */
router.post("/vocabs/file/:collectionId", upload.single("file"), vocab.createVocabFromFile);
/**
 * @swagger
 * /api/vocabs/ai-generate/{collectionId}:
 *   post:
 *     summary: Generate vocabulary words using AI (OpenAI) for a collection
 *     tags: [Vocabs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: collectionId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Collection ID to add generated words to
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - topic
 *               - count
 *             properties:
 *               topic:
 *                 type: string
 *                 example: Animals
 *                 description: Topic for vocabulary generation
 *               count:
 *                 type: integer
 *                 example: 5
 *                 description: Number of words to generate (max 20)
 *     responses:
 *       200:
 *         description: Words generated and added to collection
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 words:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       word:
 *                         type: string
 *                       description:
 *                         type: string
 *                       example:
 *                         type: string
 *       400:
 *         description: Validation error or missing parameters
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Collection not found or not yours
 *       500:
 *         description: AI generation failed
 */
router.post("/vocabs/ai-generate/:collectionId", vocab.generateWordsByAI);
router.get("/vocabs", vocab.getVocabs);

/**
 * @swagger
 * /api/vocabs/{id}:
 *   get:
 *     summary: Get a vocab by ID
 *     tags: [Vocabs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Vocab ID
 *     responses:
 *       200:
 *         description: Vocab found
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Vocab not found
 *   put:
 *     summary: Update a vocab by ID
 *     tags: [Vocabs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Vocab ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               word:
 *                 type: string
 *                 example: banana
 *               description:
 *                 type: string
 *                 example: A yellow fruit
 *               example:
 *                 type: string
 *                 example: I eat a banana every day.
 *     responses:
 *       200:
 *         description: Vocab updated
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Vocab not found or not yours
 *   delete:
 *     summary: Delete a vocab by ID
 *     tags: [Vocabs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Vocab ID
 *     responses:
 *       200:
 *         description: Vocab deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Vocab not found or not yours
 */
router.get("/vocabs/:id", vocab.getVocabById);
router.put("/vocabs/:id", vocab.updateVocab);
router.delete("/vocabs/:id", vocab.deleteVocab);


/**
 * @swagger
 * /api/review/today:
 *   get:
 *     summary: Get collections due for review today
 *     tags: [Review]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of collections due for review
 *       401:
 *         description: Unauthorized
 */
router.get("/review/today", review.getTodayReview);

/**
 * @swagger
 * /api/review/complete/{taskId}:
 *   post:
 *     summary: Mark a review task as completed and schedule the next review
 *     tags: [Review]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the review task
 *     responses:
 *       200:
 *         description: Review task updated
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Task not found
 */
router.post("/review/complete/:taskId", review.markReviewCompleted);

/**
 * @swagger
 * /api/review/reset/{taskId}:
 *   post:
 *     summary: Reset a review task to start the spaced repetition sequence from the beginning
 *     tags: [Review]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the review task
 *     responses:
 *       200:
 *         description: Review task reset
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Task not found
 */
router.post("/review/reset/:taskId", review.resetReviewTask);

export default router;
