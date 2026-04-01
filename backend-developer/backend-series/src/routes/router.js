import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js"; // ✅ Added .js
import { upload } from "../middlewares/multer.middleware.js"; // ✅ Ensure correct export

const router = Router();

// ✅ Register route
router.post(
  '/register',
  upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 }
  ]),
  registerUser
);

export default router;
