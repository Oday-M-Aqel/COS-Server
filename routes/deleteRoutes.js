const express = require('express');
const router = express.Router();
const verifyAdmin = require('../middleware/verifyAdminToken');
const { verifyToken } = require('../middleware/verifyToken');
const Delete = require('../controller/eventController');

router.delete('/doctors', verifyAdmin, Delete.deleteDoctorById);
router.delete('/patient', verifyToken, Delete.deletePatientById);
router.delete('/appointment', verifyAdmin, Delete.deleteAppointmentById);
router.delete('/contact', verifyAdmin, Delete.deleteContactById);

module.exports = router;