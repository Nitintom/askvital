import express from "express";
import {
  createReview,
  getAllReviews,
  getReviewById,
  updateReviewById,
  deleteReviewById,
} from "../controllers/review.controller.js";

const router = express.Router();

// Define your review routes
router.post("/reviews", createReview);
router.post("/healthcare/:id/reviews", createReview); // This is for creating reviews associated with a healthcare entity
router.get("/reviews", getAllReviews);
router.get("/reviews/:id", getReviewById);
router.put("/reviews/:id", updateReviewById);
router.delete("/reviews/:id", deleteReviewById);

export default router;
