import express from "express";
import {
  updateUser,
  deleteUser,
  adminRoute,
  signup, // Import the signup function
  signin, // Import the signin function
  deleteUserByAdmin,
} from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/verifyUser.js";
import { isAdmin } from "../middleware/isAdmin.js";

const router = express.Router();

router.post("/update/:id", verifyToken, updateUser);
router.delete("/delete/:id", verifyToken, deleteUser);
router.post("/signup", signup); // Route for ser registration
router.post("/signin", signin); // Route for user login

// Admin-only route
router.get("/admin-route", adminRoute);

// Admin-only route to delete a user
router.delete("/admin-delete/:id", deleteUserByAdmin);

export default router;
