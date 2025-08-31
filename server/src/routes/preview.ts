import { Router } from "express";
import { body } from "express-validator";
import { getPreview } from "../controllers/previewController";
import { rateLimiter } from "../middleware/security";

const router = Router();

router.post(
  "/",
  rateLimiter,
  body("url").isURL().withMessage("A valid URL is required"),
  getPreview
);

export default router;
