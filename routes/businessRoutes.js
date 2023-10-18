import express from "express";
import {
  submitBusiness,
  getPendingSubmissions,
  updateSubmissionStatus,
  deleteSubmission, // Import the new controller function
} from "../controllers/businessController.js";

const router = express.Router();

// Define a route to submit a new business
router.post("/submit-business", submitBusiness);

// Define a route to get pending submissions (for admin)
router.get("/admin/pending-submissions", getPendingSubmissions);

// Define a route to approve or deny a business submission (for admin)
router.post("/admin/update-submission-status", updateSubmissionStatus);

// Define a route to delete a business submission (for admin)
router.delete("/admin/delete-submission", deleteSubmission);

export default router;
