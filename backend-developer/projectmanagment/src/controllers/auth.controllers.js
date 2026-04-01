import {User} from "../models/user.model.js";
import {ApiResponse} from "../utils/api-response.js";
import {Apierror} from "../utils/api-error.js";
import {asyncHandler} from "../utils/async-handler.js";
import { sendEmail, emailVerificationMailgenContent, forgotPasswordMailgenContent } from "../utils/mail.js";

  const generateAccessAndRefreshToken = async(userId) =>{
    try {
          const user = await User.findById(userId);

      const accessToken = user.generateAccessToken();
       const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save({validateBeforeSave:false});

    return {accessToken,refreshToken};


    } catch (error) {
    
        throw new Error(500,"wrong in generating")
    }
  }


  const login  = asyncHandler(async (req,res)=>{

    const {email:rawEmail,password} = req.body;
    const email = rawEmail?.toLowerCase().trim();
    const user = await User.findOne({email}).select("+password +refreshToken");
    if(!user){
        throw new Apierror(404,"user not found");
    }
    const isPasswordMatched = await user.comparePassword(password);
    if(!isPasswordMatched){
        throw new Apierror(401,"password is incorrect");
    }
    const {accessToken,refreshToken} = await generateAccessAndRefreshToken(user._id);
    // Set refresh token cookie (long lived) and access token cookie (short lived)
    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    };

    res.cookie("refreshToken", refreshToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Access token cookie is short lived (e.g. 15 minutes)
    res.cookie("accessToken", accessToken, {
        ...cookieOptions,
        maxAge: 15 * 60 * 1000, // 15 minutes
    });
    const userData = await User.findById(user._id).select("-password -__v -refreshToken -emailVerificationToken -emailVerificationTokenExpiry -forgotPasswordToken -forgotPasswordTokenExpiry ")
    return res.status(200).json(new ApiResponse(200, "login successful", { user: userData, accessToken, refreshToken }));
    })


 


const registeuser = asyncHandler(async (req, res) => {
    // normalize incoming values to avoid accidental duplicates
    const { email: rawEmail, username: rawUsername, name: rawName, password, role } = req.body;

    const email = rawEmail?.toLowerCase().trim();
    let username = rawUsername?.toLowerCase().trim();
    const fullName = rawName?.trim();

    // If username is not provided, try to derive it from name or email prefix
    if (!username) {
        if (fullName) {
            username = fullName.split(' ').join('').toLowerCase();
        } else if (email) {
            username = email.split('@')[0];
        }
    }

    // case-insensitive / normalized duplicate check
    const existedUser = await User.findOne({
        $or: [{ username }, { email }],
    });

    if (existedUser) {
        // 409 Conflict is more semantically correct for duplicates
        throw new Apierror(409, 'User already exists');
    }

    const user = await User.create({
        email,
        password,
        username,
        fullName,
        isEmailVerified: false,
    });

    const {unHashedToken,hashedToken,tokenExpiry} = user.generateTemporyToken();


    user.emailVerificationToken = hashedToken;
    user.emailVerificationTokenExpiry = tokenExpiry;

    await user.save({validateBeforeSave : false});

    // build verification URL from environment variables (fallback to localhost)
    const port = process.env.PORT || '7878';
    const base = process.env.BASE_URL || `http://localhost:${port}`;

    await sendEmail({
        email: user?.email,
        subject: 'Please verify your email',
        mailgenContext: emailVerificationMailgenContent(
            user.username,
            `${base}/api/v1/auth/verify-email?token=${unHashedToken}&id=${user._id}`
        ),
    });
    const createUSer = await User.findById(user._id).select("-password -__v -refreshToken -emailVerificationToken -emailVerificationTokenExpiry -forgotPasswordToken -forgotPasswordTokenExpiry ")
 

    if(!createUSer){
        throw new Apierror(500,"user not found after create");

    }


    return res.status(201).json(new ApiResponse(201, "user created successfully", createUSer));
});



const logout = asyncHandler(async(req,res)=>{
  await User.findByIdAndUpdate(
    req.user._id,
    {
    $set:{refreshToken:""}
    },
    {new:true}
  );

  const options ={
    httpOnly:true,
    secure:true,
  }
 return res.clearCookie("refreshToken",options).status(200).json(new ApiResponse(200,"logout successfully"));
  })


  const getCurrentUser  =asyncHandler(async(req,res)=>{
    return res.status(200).json(new ApiResponse(200,"current user fetched successfully",req.user));
  })

const emailverfiy = asyncHandler(async(req,res)=>{
    const {token,id} = req.body;
    if(!token || !id){
        throw new Apierror(400,"token and id are required");
    }
    const user = await User.find
ById(id).select("+emailVerificationToken +emailVerificationTokenExpiry");
    if(!user){
        throw new Apierror(404,"user not found");
    }
    if(user.isEmailVerified){
        throw new Apierror(400,"email already verified");
    }
    if(user.emailVerificationToken !== user.generateHash(token)){
        throw new Apierror(400,"invalid token");
    }
    if(user.emailVerificationTokenExpiry < Date.now()){
        throw new Apierror(400,"token expired");
    }
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationTokenExpiry = undefined;  
    await user.save({validateBeforeSave:false});
    return res.status(200).json(new ApiResponse(200,"email verified successfully"));
    })



    const resendEmailverfiy  = asyncHandler(async(req,res)=>{
        const {id} = req.body;
        if(!id){
            throw new Apierror(400,"id is required");
        }
        const user = await User.findById(id).select("+emailVerificationToken +emailVerificationTokenExpiry +isEmailVerified");
        if(!user){
            throw new Apierror(404,"user not found");
        }
        if(user.isEmailVerified){
            throw new Apierror(400,"email already verified");
        }
        const {unHashedToken,hashedToken,tokenExpiry} = user.generateTemporyToken();
        user.emailVerificationToken = hashedToken;
        user.emailVerificationTokenExpiry = tokenExpiry;
        await user.save({validateBeforeSave : false});
        // build verification URL from environment variables (fallback to localhost)
        const port = process.env.PORT || '7878';
        const base = process.env.BASE_URL || `http://localhost:${port}`;
        await sendEmail({
            email: user?.email,
            subject: 'Please verify your email',
            mailgenContext: emailVerificationMailgenContent(
                user.username,
                `${base}/api/v1/auth/verify-email?token=${unHashedToken}&id=${user._id}`
            ),
        });
        return res.status(200).json(new ApiResponse(200,"verification email sent successfully"));
    }
    )

    const refreshToken = asyncHandler(async(req,res,next)=>{
        const token = req.cookies?.refreshToken;
        if(!token){
            throw new Apierror(401,"refresh token missing");
        }
        let decodeToken;
        try {
            decodeToken = jwt.verify(token,process.env.REFRESH_TOKEN_SECRET);
        } catch (error) {
            throw new Apierror(401,"invalid or expired refresh token");
        }
        const user = await User.findById(decodeToken._id).select("+refreshToken");
        if(!user){
            throw new Apierror(404,"user not found");
        }
        if(user.refreshToken !== token){
            throw new Apierror(401,"refresh token mismatch");
        }
        const {accessToken,refreshToken:newRefreshToken} = await generateAccessAndRefreshToken(user._id);
        // Set refresh token cookie (long lived) and access token cookie (short lived)
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        };
        res.cookie("refreshToken", newRefreshToken, {
            ...cookieOptions,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        // Access token cookie is short lived (e.g. 15 minutes)
        res.cookie("accessToken", accessToken, {

            ...cookieOptions,
            maxAge: 15 * 60 * 1000, // 15 minutes
        });
        return res.status(200).json(new ApiResponse(200,"token refreshed successfully",{accessToken,newRefreshToken}));
    })
 
     




const forgotPasswordRequest = asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) {
        throw new Apierror(400, "Email is required");
    }
    const user = await User.findOne({ email });
    if (!user) {
        throw new Apierror(404, "User not found");
    }
    // Generate forgot password token and send email
    const { unHashedToken, hashedToken, tokenExpiry } = user.generateTemporyToken();
    user.forgotPasswordToken = hashedToken;
    user.forgotPasswordTokenExpiry = tokenExpiry;
    await user.save({ validateBeforeSave: false });
    await sendEmail({
        email: user.email,
        subject: 'Reset your password',
        mailgenContext: forgotPasswordMailgenContent(user.username, `${process.env.BASE_URL}/api/v1/auth/reset-password?token=${unHashedToken}&id=${user._id}`)
    });
    return res.status(200).json(new ApiResponse(200, "Forgot password email sent successfully"));
});

const resetForgotPassword = asyncHandler(async (req, res) => {
    const { token, id, newPassword } = req.body;
    if (!token || !id || !newPassword) {
        throw new Apierror(400, "Token, id, and new password are required");
    }
    const user = await User.findById(id).select("+forgotPasswordToken +forgotPasswordTokenExpiry");
    if (!user || user.forgotPasswordToken !== user.generateHash(token) || user.forgotPasswordTokenExpiry < Date.now()) {
        throw new Apierror(400, "Invalid or expired token");
    }
    user.password = newPassword;
    user.forgotPasswordToken = undefined;
    user.forgotPasswordTokenExpiry = undefined;
    await user.save();
    return res.status(200).json(new ApiResponse(200, "Password reset successfully"));
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select("+password");
    if (!user || !(await user.comparePassword(currentPassword))) {
        throw new Apierror(401, "Current password is incorrect");
    }
    user.password = newPassword;
    await user.save();
    return res.status(200).json(new ApiResponse(200, "Password changed successfully"));
});

export {registeuser,login,logout,getCurrentUser,emailverfiy,resendEmailverfiy,refreshToken,forgotPasswordRequest,resetForgotPassword,changeCurrentPassword};