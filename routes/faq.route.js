import express from "express";
import {
  createFAQ,
  updateFAQ,
  getAllFAQs,
} from "../controllers/faq.controller.js";

const router = express.Router();

// Create a new FAQ for a Healthcare Entity
router.post("/api/healthcare/:id/faq", createFAQ);

// Update an FAQ for a Healthcare Entity
router.put("/api/healthcare/:id/faq/:faqId", updateFAQ);

// Get all FAQs for a Healthcare Entity
router.get("/api/healthcare/:id/faqs", getAllFAQs);

export default router;
