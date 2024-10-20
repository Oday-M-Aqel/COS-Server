const express = require("express");
const route = express.Router();
const verifyAdmin = require("../middleware/verifyAdminToken");
const Get = require("../controller/eventController");

route.get("/doctors/:page/:limit", Get.getDoctors);
route.get("/appointment/:page/:limit/:doctor_id", Get.getAppointment);
route.get("/patientRecords/:page/:limit", verifyAdmin, Get.getPatients);
route.get("/search", Get.searchDoctor);
route.get("/contacts/:page/:limit", verifyAdmin, Get.getContacts);
route.get('/medications/:doctor_id/:page/:limit', Get.getMedication);

module.exports = route;
