import express from "express";
import * as accountController from "../controllers/account.controller.js";

const router = express.Router();

router.post("/account/signup", accountController.signup);
router.post("/account/signin", accountController.signin);
router.post("/account/google", accountController.google);
router.post("/account/signout", accountController.signout);

// Additional routes
router.put("/account/update/:id", accountController.updateUser);
router.delete("/account/delete/:id", accountController.deleteUser);

// Admin routes
router.get("/account/admin/users", accountController.adminRoute);
router.delete("/account/admin/delete/:id", accountController.deleteUserByAdmin);

export default router;

