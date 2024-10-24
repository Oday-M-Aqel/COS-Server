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
  name: {
    type: String,
    required: true,
  },
  cash: {
    type: Number,
  },
  date: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['pending','in_progress', 'completed', 'canceled'],
  },
  note: {
    type: Array,
  },
  description: {
    type: String,
  },
});

module.exports = medication = mongoose.model("medication", medication_Schema);
