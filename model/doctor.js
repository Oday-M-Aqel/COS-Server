const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const doctorSchema = new mongoose.Schema({
  first_Name: {
    type: String,
    required: true,
    minlength: 3,
  },
  last_Name: {
    type: String,
    required: true,
    minlength: 3,
  },
  country: {
    type: String,
  },
  city: {
    type: String,
  },
  avatar: {
    type: String,
  },
  is_Admin: {
    type: Boolean,
    default: false,
  },
  birthdate: {
    type: Date,
  },
  qualification: {
    type: String,
  },
  experience: {
    type: String,
  },
  specialization: {
    type: String,
  },
  description: {
    type: String,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Pre-save hook for password hashing
doctorSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    } catch (err) {
      next(err);
    }
  } else {
    next();
  }
});

module.exports = mongoose.model("Doctor", doctorSchema);
