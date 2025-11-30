import express from "express";
import { dbConnection } from "./database/dbConnection.js";
import jobRouter from "./routes/jobRoutes.js";
import userRouter from "./routes/userRoutes.js";
import applicationRouter from "./routes/applicationRoutes.js";
import { config } from "dotenv";
import cors from "cors";
import { errorMiddleware } from "./middlewares/error.js";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";

const app = express();

config({ path: "./config/config.env" });

// ✅ CORS FIXED (Frontend runs on port 5174)
app.use(
    cors({
        origin: "http://localhost:5174",
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
    })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ File Upload
app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "tmp/",
    })
);

// ✅ Routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/job", jobRouter);
app.use("/api/v1/application", applicationRouter);

// ✅ Database
dbConnection();

// ✅ Error middleware
app.use(errorMiddleware);

export default app;