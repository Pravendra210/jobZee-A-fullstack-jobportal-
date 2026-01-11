import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import { User } from "../models/userSchema.js";
import ErrorHandler from "../middlewares/error.js";
import { sendToken } from "../utils/jwtToken.js";

/* =======================
   REGISTER
======================= */
export const register = catchAsyncErrors(async(req, res, next) => {
    const { name, email, phone, password, role } = req.body;

    if (!name || !email || !phone || !password || !role) {
        return next(new ErrorHandler("Please fill full form!", 400));
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return next(new ErrorHandler("Email already registered!", 400));
    }

    const user = await User.create({
        name,
        email,
        phone,
        password,
        role,
    });

    // sends cookie + response
    sendToken(user, 201, res, "User Registered Successfully!");
});

/* =======================
   LOGIN
======================= */
export const login = catchAsyncErrors(async(req, res, next) => {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
        return next(
            new ErrorHandler("Please provide email, password and role.", 400)
        );
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return next(new ErrorHandler("Invalid Email or Password.", 400));
    }

    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid Email or Password.", 400));
    }

    if (user.role !== role) {
        return next(
            new ErrorHandler(`User with role ${role} not found!`, 404)
        );
    }

    // sends cookie + response
    sendToken(user, 200, res, "Login Successful!");
});

/* =======================
   LOGOUT
======================= */
export const logout = catchAsyncErrors(async(req, res, next) => {
    res
        .status(200)
        .cookie("token", "", {
            httpOnly: true,
            secure: true, // 🔴 REQUIRED on Vercel
            sameSite: "None", // 🔴 REQUIRED cross-site
            expires: new Date(Date.now()),
        })
        .json({
            success: true,
            message: "Logged Out Successfully.",
        });
});

/* =======================
   GET LOGGED IN USER
======================= */
export const getUser = catchAsyncErrors(async(req, res, next) => {
    res.status(200).json({
        success: true,
        user: req.user,
    });
});