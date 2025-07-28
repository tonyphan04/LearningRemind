import { Router } from "express";
import * as auth from "../controller/auth.controller";
import * as folder from "../controller/folder.controller";
import * as vocab from "../controller/vocab.controller";
import * as review from "../controller/review.controller";

const router = Router();

// Auth
router.post("/auth/login", auth.login);
router.post("/auth/signup", auth.signup);
router.post("/auth/change-password", auth.changePassword);
//router.get("/auth/me", auth.getCurrentUser);

// Folder (Collection)
router.post("/folders", folder.createFolder);
router.get("/folders", folder.getFolders);
router.get("/folders/:id", folder.getFolderById);
router.get("/folders/search", folder.getFolderByName);
router.put("/folders/:id", folder.updateFolder);
router.delete("/folders/:id", folder.deleteFolder);

// Vocab (Word)
router.post("/vocabs", vocab.createVocab);
router.get("/vocabs", vocab.getVocabs);
router.get("/vocabs/:id", vocab.getVocabById);
router.put("/vocabs/:id", vocab.updateVocab);
router.delete("/vocabs/:id", vocab.deleteVocab);

// Review/Spaced Repetition
router.get("/review/today", review.getTodayReview);

export default router;
