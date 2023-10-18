import express from "express";
import multer from "multer";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors";
import adminRoutes from "./routes/admin.auth.js";
import passport from "./config/passport.js";
import session from "express-session";
import ensureAdminAuthenticated from "./routes/admin.js";
import healthcareRoutes from "./routes/healthcare.route.js";
import reviewRoutes from "./routes/review.js";
import faqRoutes from "./routes/faq.route.js";
import businessRoutes from "./routes/businessRoutes.js";

dotenv.config();

mongoose
  .connect(process.env.MONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

const __dirname = path.resolve();
const app = express();
app.use(express.json());
const port = 8080;

app.use(
  cors({
    origin: "http://askvital.com",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

const JWT_SECRET = process.env.JWT_SECRET;

app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get("/api/config", (req, res) => {
  res.json({ JWT_SECRET });
});

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads"); // Destination folder for uploaded files
  },
  filename: (req, file, cb) => {
    // Set the filename for the uploaded file
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.use(express.static("public"));

app.use(express.json());
app.use(cookieParser());

// Use Multer middleware to handle file uploads for the healthcare route
app.use("/api/healthcare", upload.single("image"), (req, res, next) => {
  // This middleware will handle file uploads and make the uploaded file accessible via req.file
  next();
});

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", adminRoutes);
app.use("/api", reviewRoutes);
app.use("/api", healthcareRoutes);
app.use(faqRoutes);
app.use("/api/business", businessRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  console.error("Error:", err); // Log the error
  return res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
});

app.listen(port, () => {
  console.log(`Server connected to http://localhost:${port}`);
});
