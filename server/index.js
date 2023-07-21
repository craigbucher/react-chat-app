import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import { Configuration, OpenAIApi } from "openai";
import openAiRoutes from "./routes/openai.js";
import authRoutes from "./routes/auth.js";

/* CONFIGURATIONS */
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));  // using 'common' settings
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

/* OPEN AI CONFIGURATION */
// from example at https://github.com/openai/openai-node
const configuration = new Configuration({
  apiKey: process.env.OPEN_API_KEY,
});
export const openai = new OpenAIApi(configuration);

/* ROUTES */
app.use("/openai", openAiRoutes); // routes will always begin with '/openai'
app.use("/auth", authRoutes); // routes will always begin with '/auth'

/* SERVER SETUP */
const PORT = process.env.PORT || 9000;  // use 9000 if can't read env variable
app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
