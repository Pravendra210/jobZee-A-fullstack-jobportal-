import { config } from "dotenv";
config({ path: "./config/config.env" }); // LOAD ENV FIRST

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";

import { dbConnection } from "./database/dbConnection.js";
import jobRouter from "./routes/jobRoutes.js";
import userRouter from "./routes/userRoutes.js";
import applicationRouter from "./routes/applicationRoutes.js";
import { errorMiddleware } from "./middlewares/error.js";

const app = express();

/* =======================
   ✅ CORS (FINAL FIX)
======================= */
app.use(
    cors({
        origin: [
            "http://localhost:5173", // local frontend
            process.env.FRONTEND_URL, // vercel frontend
        ],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
);

/* =======================
   MIDDLEWARES
======================= */
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
    })
);

/* =======================
   ROUTES
======================= */
app.use("/api/v1/user", userRouter);
app.use("/api/v1/job", jobRouter);
app.use("/api/v1/application", applicationRouter);

/* =======================
   DATABASE
======================= */
dbConnection();

/* =======================
   ERROR HANDLER
======================= */
app.use(errorMiddleware);

export default app;