const express = require("express");
const cors = require("cors");
const dotenv = require('dotenv');
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const addRoutes = require("./routes/addRoutes");
const deleteRoutes = require("./routes/deleteRoutes");
const updateRoutes = require("./routes/updateRoutes");
const path = require("path");
dotenv.config();
// Initialize Express app
const app = express();
app.use(cookieParser());

const PORT = process.env.PORT || 3000;
// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || `http://localhost:${PORT}`,
  methods: "GET,PUT,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Connect to MongoDB using Mongoose
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log("Connected to MongoDB."))
.catch(err => {
  console.error("Error connecting to MongoDB:", err.message);
});

// Use routes
app.use("/auth", authRoutes); // Prefix routes with /auth
app.use("/add", addRoutes);
app.use("/delete", deleteRoutes);
app.use("/update", updateRoutes);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => res.send("Hello World!"));

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});