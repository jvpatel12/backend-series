import { Router } from "express";
import { registeuser, login, logout, refreshToken, getCurrentUser, forgotPasswordRequest, resetForgotPassword, changeCurrentPassword } from "../controllers/auth.controllers.js";
import { validate } from "../middlewares/validator.middleware.js";
import { registerValidator,loginValidator,changePasswordValidator,resetPasswordValidator,forgotPasswordValidator,emailVerificationValidator} from "../validators/index.js";

import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

// use the validator array directly (it's exported as an array of middleware)
router.post("/register", registerValidator, validate, registeuser);
router.post("/login",loginValidator,validate, login);
router.route("/logout").post(verifyJwt,logout);
router.route("/verify-email/:verificationToken").get(emailVerificationValidator);
router.route("/refresh-token").post(refreshToken);
router.route("/forgot-password").post(forgotPasswordValidator,validate,forgotPasswordRequest);
router.route("/reset-password").post(resetPasswordValidator,validate,resetForgotPassword);
router.route("/change-password").post(verifyJwt,changePasswordValidator,validate,changeCurrentPassword);
router.route("/curent-user").post(verifyJwt,getCurrentUser);
router.route("/change-password").post(verifyJwt,changePasswordValidator,validate,changeCurrentPassword);
router.route("/").get(verifyJwt,getCurrentUser);

export default router;
