import { asyncHandler } from '../utils/asyncHandler.js';
import { User } from '../models/User.js';
import ApiError from '../utils/ApiError.js';  // ✅ Correct import (default export)
import { uploadOnCloudinary } from '../utils/cloudinary.js'; // ✅ Match function name

const registerUser = asyncHandler(async (req, res) => {
    // ✅ Get user details
    const { fullName, username, email, password } = req.body;
    console.log("email:", email);

    // ✅ Validation
    if ([fullName, username, email, password].some(field => !field)) {
        throw new ApiError(400, "All fields are required");
    }

    // ✅ Check if user exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
        throw new ApiError(400, "Username or Email already exists");
    }

    // ✅ Get uploaded files (from Multer)
    const avatar = req.files?.['avatar']?.[0]?.path || '';
    const coverImage = req.files?.['coverImage']?.[0]?.path || '';

    if (!avatar) {
        throw new ApiError(400, "Avatar is required");
    }

    // ✅ Upload images to Cloudinary
    const avatarUrl = await uploadOnCloudinary(avatar);
    const coverImageUrl = coverImage ? await uploadOnCloudinary(coverImage) : '';

    if (!avatarUrl) {
        throw new ApiError(500, "Failed to upload avatar");
    }

    // ✅ Create User
    const user = await User.create({
        fullName,
        username,
        email,
        password, // hashed by model pre-save
        avatar: avatarUrl,
        coverImage: coverImageUrl
    });

    if (!user) {
        throw new ApiError(500, "User creation failed");
    }

    // ✅ Remove sensitive fields
    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.refreshToken;

    // ✅ Send response
    res.status(201).json({
        success: true,
        message: "User registered successfully",
        user: userResponse
    });
});

export { registerUser };
