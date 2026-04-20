import express from "express";
import logoutContrroller from "../controllers/logoutController.js";

const router = express.Router();
router.route("/").post(logoutContrroller.logout);

export default router;
