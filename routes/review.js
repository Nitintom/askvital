import express from "express";
import {
  createReview,
  getAllReviews,
  getReviewById,
  updateReviewByNameAndId,
  deleteReviewByNameAndId,
} from "../controllers/review.controller.js";

const router = express.Router();

// Define your review routes
router.post("/reviews", createReview);
router.post("/healthcare/:id/reviews", createReview);
router.get("/reviews", getAllReviews);
router.get("/reviews/:id", getReviewById);
router.put("/healthcare/:name/reviews/:reviewId", updateReviewByNameAndId);

router.delete("/healthcare/:name/reviews/:reviewId", deleteReviewByNameAndId);

export default router;
