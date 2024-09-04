import express from "express";
import cors from "cors";
import morgan from "morgan";
import { secrets } from "./config/constants";
import "./utils/redis"; // Redis client configuration
import authenticateToken from "./middleware/auth";
import session from 'express-session';

import mangaRouter from "./routes/mangaRoutes";
import authRouter from "./routes/auth";

const app = express();
app.use(cors());
app.use(morgan("dev"));


app.use(session({
    secret: process.env.SESSION_SECRET || '',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production', 
        maxAge: 1000 * 60 * 60 * 24 * 7, 
    }
}));

app.use(express.json());

app.use("/api/v1/manga", mangaRouter);
app.use("/auth", authRouter);

// Start the server
app.listen(secrets.PORT, () => {
  console.log(`Server is running on ${secrets.PORT} 🦄`);
});
