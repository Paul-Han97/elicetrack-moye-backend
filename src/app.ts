import express from "express";
import path from "path";
import logger from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(cors()); // CORS 설정 추가
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(logger("dev"));

export default app;
