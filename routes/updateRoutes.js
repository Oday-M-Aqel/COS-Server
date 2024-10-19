const express = require("express");
const router = express.Router();
const verifyAdmin = require("../middleware/verifyAdminToken");
const { verifyToken } = require("../middleware/verifyToken");
const update = require("../controller/eventController");

router.put("/doctor", verifyToken, update.updateDoctorById);
router.put("/patient", verifyToken, update.updatePatientById);
router.put("/medication", verifyToken, update.updateMedication);

module.exports = router;
