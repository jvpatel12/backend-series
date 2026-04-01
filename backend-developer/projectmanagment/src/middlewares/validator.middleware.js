import { validationResult } from "express-validator";

import { Apierror } from "../utils/api-error.js";


export const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));
  return next(new Apierror(422, "Validation Error", extractedErrors));
};
