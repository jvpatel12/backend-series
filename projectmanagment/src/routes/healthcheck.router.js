import { Router } from "express";
import { healthcheck } from "../controllers/healthcheck.controller.js";

const router = Router();

router.route('/').get(healthcheck);
router.route('/instragram').get(healthcheck);
export default router;

