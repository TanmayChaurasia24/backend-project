import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userrouter from "./routes/user.routes.js";
import commentrouter from "./routes/comments.routes.js"
import videorouter from "./routes/video.routes.js"

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({ limit: "16mb" }));
app.use(express.urlencoded({ extended: true, limit: "16mb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.use("/api/users", userrouter);
app.use("api",commentrouter)
app.use("api",videorouter)


export { app };
