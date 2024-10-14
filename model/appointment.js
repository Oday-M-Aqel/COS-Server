const mongoose = require("mongoose");

const appointment_Schema = new mongoose.Schema({
  doctor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "doctor",
    required: true,
  },
  patient_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "patient",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  details: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

appointment_Schema.pre("save", async function(next){
  if (this.isNew) {
    const currentUTC = new Date(this.createdAt || Date.now()); // Get UTC time
    currentUTC.setHours(currentUTC.getHours() + 3);            // Adjust to +3 hours
    this.createdAt = currentUTC;                               // Set adjusted time
  }
  next();
});

module.exports = appointment = mongoose.model(
  "appointment",
  appointment_Schema
);
