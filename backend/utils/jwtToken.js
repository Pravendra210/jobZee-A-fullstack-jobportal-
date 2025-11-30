import jwt from "jsonwebtoken";

export const sendToken = (user, statusCode, res) => {
    const token = jwt.sign({ id: user._id },
        process.env.JWT_SECRET_KEY, // 🔥 Same name as in .env
        {
            expiresIn: String(process.env.JWT_EXPIRE) || "5d", // 🔥 FIXED
        }
    );

    res.status(statusCode)
        .cookie("token", token, {
            httpOnly: true,
            expires: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
            sameSite: "lax",
        })
        .json({
            success: true,
            token,
            user,
        });
};