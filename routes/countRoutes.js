const express = require("express");
const route = express.Router();
const count = require("../controller/eventController");

route.get("/countDoctor", count.countDoctor);
route.get("/countPatient", count.countPatients);
route.get("/countAppointment", count.countAppointments);
route.get("/countAppForDoctor/:doctor_id", count.countAppForDoctors);
route.get("/countMedication", count.countMedications);

module.exports = route;
