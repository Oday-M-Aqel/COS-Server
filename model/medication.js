const mongoose = require("mongoose");

const medication_Schema = new mongoose.Schema({
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
  cash: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'dispensed', 'in_progress', 'completed', 'canceled', 'expired'],
    required: true,
  },
  note: {
    type: Array,
  },
  description: {
    type: String,
  },
});

module.exports = medication = mongoose.model("medication", medication_Schema);
