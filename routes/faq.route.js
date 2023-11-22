import express from "express";
import {
  createFAQ,
  updateFAQ,
  deleteFAQ,
  getAllFAQs,
} from "../controllers/faq.controller.js";

const router = express.Router();

// Create a new FAQ for a Healthcare Entity
router.post("/healthcare/:id/faq", createFAQ);

// Update an FAQ for a Healthcare Entity
router.put("/healthcare/:name/faq/:faqId", updateFAQ);

// Delete an FAQ for a Healthcare Entity
router.delete("/healthcare/:name/faq/:faqId", deleteFAQ);

// Get all FAQs for a Healthcare Entity
router.get("/healthcare/:id/faqs", getAllFAQs);

export default router;
