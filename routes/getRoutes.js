const express = require("express");
const route = express.Router();
const verifyAdmin = require("../middleware/verifyAdminToken");
const Get = require("../controller/eventController");

route.get("/doctors/:page/:limit", Get.getDoctors);
route.get("/appointment/:page/:limit", Get.getAppointment);
route.get("/patientRecords/:page/:limit", Get.getPatients);
route.get("/search", Get.searchDoctor);
route.get("/contacts/:page/:limit", Get.getContacts);
route.get('/medications/:doctor_id', Get.getMedication);


module.exports = route;
