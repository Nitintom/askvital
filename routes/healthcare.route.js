import express from "express";
import {
  getAllHealthcare,
  createHealthcare,
  updateHealthcare,
  deleteHealthcare,
  getHealthcareById,
  getHealthcareByCity,
  uploadAndImportExcel,
  getHealthcareByName,
  // Add other controllers as needed
} from "../controllers/healthcare.controller.js";

const router = express.Router();

// Public routes
router.get("/healthcare", getAllHealthcare);
router.get("/healthcare/:id", getHealthcareById);
router.get("/healthcare/:name", getHealthcareByName);
router.get("/healthcare/city/:city", getHealthcareByCity);

// Admin routes

// Route to handle single healthcare addition (with image upload)
router.post("/healthcare", createHealthcare);

// Update an existing healthcare entity
router.put("/healthcare/:id", updateHealthcare);

// Delete a healthcare entity
router.delete("/healthcare/:id", deleteHealthcare);

router.post("/upload-excel", uploadAndImportExcel);

export default router;
