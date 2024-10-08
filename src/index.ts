import "dotenv/config";
import cors from "cors";
import config from "./config";
import express from "express";

const PORT = config.server.port;
const app = express();

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
