import express from "express";
import {
  createShortUrl,
  getUrlStats,
} from "../controllers/shortUrl.controller.js";

const router = express.Router();

router.post("/", createShortUrl);
router.get("/:shortcode", getUrlStats);

export default router;
