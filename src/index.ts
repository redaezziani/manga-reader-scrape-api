import express from "express";
import cors from "cors";
import morgan from "morgan";
import { secrets } from "./config/constants";
import passport from "passport";
import session from "express-session";
import path from "path";
import "./utils/redis"; // Redis client configuration
import "./service/strategie/git-hub"; // GitHub strategy configuration
import authenticateToken from "./middleware/auth";


import mangaRouter from "./routes/mangaRoutes";
import webRouter from "./routes/webRoutes";

const app = express();
app.use(cors());

// Set up views with EJS
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(morgan("dev"));
app.use(express.json());

app.use(
  session({
    secret: "keyboard cat", // Use a secure secret in production
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: "auto",
      maxAge: 1000 * 60 * 60 * 24, // Cookie expiration time (24 hours)
    },
  })
);

// Initialize Passport for authentication
app.use(passport.initialize());
app.use(passport.session());

app.get(
  "/api/v1/auth/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

app.get(
  "/api/v1/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("/web");
  }
);

// Other application routes
app.use("/api/v1/manga", mangaRouter);
app.use("/web", webRouter);

// Start the server
app.listen(secrets.PORT, () => {
  console.log(`Server is running on ${secrets.PORT} 🦄`);
});
