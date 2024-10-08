const express = require("express");
const router = express.Router();
const verifyAdmin = require("../middleware/verifyAdminToken");
const createDoctor = require("../controller/admin/addDoctor");
const add = require("../controller/eventController");
const { addContact } = require("../controller/ContactingController");
router.post("/admin", createDoctor);
router.post("/addContact", addContact);
router.post("/addAppointment", add.addAppointment);
router.post("/addMedication", verifyAdmin, add.addMedication);

module.exports = router;
