import jwt from "jsonwebtoken";

export const sendToken = (user, statusCode, res, message) => {
    const token = jwt.sign({ id: user._id },
        process.env.JWT_SECRET_KEY, {
            expiresIn: process.env.JWT_EXPIRE || "5d",
        }
    );

    res
        .status(statusCode)
        .cookie("token", token, {
            httpOnly: true,
            secure: true, // 🔴 MUST on Vercel
            sameSite: "None", // 🔴 MUST for frontend-backend
            expires: new Date(
                Date.now() + 5 * 24 * 60 * 60 * 1000 // 5 days
            ),
        })
        .json({
            success: true,
            message,
            user,
            token,
        });
};