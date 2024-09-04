import express from "express";
import { login, register, profile } from "../controllers/authController";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/profile", profile);



export default authRouter;