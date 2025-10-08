import {body} from "express-validator";

export const registerValidator = [
    body("name").isString().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({min:6}).withMessage("Password must be at least 6 characters long"),
];  
export const loginValidator = [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({min:6}).withMessage("Password must be at least 6 characters long"),
];
export const forgotPasswordValidator = [
    body("email").isEmail().withMessage("Valid email is required"),
];
export const resetPasswordValidator = [
    body("password").isLength({min:6}).withMessage("Password must be at least 6 characters long"),
    body("confirmPassword").custom((value,{req})=>{
        if(value !== req.body.password){
            throw new Error("Password confirmation does not match password");
        }
        return true;
    }),
    body("token").isString().withMessage("Token is required"),
    body("id").isString().withMessage("User id is required"),
];
export const emailVerificationValidator = [
    body("token").isString().withMessage("Token is required"),
    body("id").isString().withMessage("User id is required"),
];


export const changePasswordValidator = [
    body("currentPassword").isLength({min:6}).withMessage("Current Password must be at least 6 characters long"),
    body("newPassword").isLength({min:6}).withMessage("New Password must be at least 6 characters long"),

    body("confirmNewPassword").custom((value,{req})=>{
        if(value !== req.body.newPassword){
            throw new Error("New Password confirmation does not match new password");
        }
        return true;
    }),
];



// add more validators as needed

