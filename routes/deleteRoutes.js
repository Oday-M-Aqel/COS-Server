const express = require('express');
const router = express.Router();
const verifyAdmin = require('../middleware/verifyAdminToken');
const { verifyToken } = require('../middleware/verifyToken');
const Delete = require('../controller/eventController');

router.delete('/doctors/:id', Delete.deleteDoctorById);
router.delete('/patient/:id', Delete.deletePatientById);
router.delete('/appointment/:id', Delete.deleteAppointmentById);
router.delete('/contact/:id', Delete.deleteContactById);

module.exports = router;