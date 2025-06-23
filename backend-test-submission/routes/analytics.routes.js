import express from "express";
import { getAllAnalytics } from "../controllers/analytics.controller.js";

const router = express.Router();
router.get("/", getAllAnalytics);

export default router;
