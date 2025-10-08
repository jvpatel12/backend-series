import { Apierror } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJwt = asyncHandler(async (req, res, next) => {
  // Accept token from cookie (accessToken) or Authorization header (Bearer <token>)
  const authHeader = req.header("Authorization") || req.headers.authorization;
  let token = req.cookies?.accessToken;

  if (!token && authHeader) {
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else {
      // If a raw token is provided without Bearer prefix, accept it too
      token = authHeader;
    }
  }

  if (!token) {
    throw new Apierror(401, "Authorization token missing");
  }

  try {
    const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodeToken._id).select("-password -__v -refreshToken -emailVerificationToken -emailVerificationTokenExpiry -forgotPasswordToken -forgotPasswordTokenExpiry ");
    if(!user){
        throw new Apierror(401,"user not found");
    }
   req.user = user;
   next();
  } catch (error) {
    // token invalid or expired
    throw new Apierror(401, "Invalid or expired token");
  }
});
