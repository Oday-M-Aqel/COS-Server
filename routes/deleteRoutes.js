const express = require('express');
const router = express.Router();
const verifyAdmin = require('../middleware/verifyAdminToken');
const { verifyToken } = require('../middleware/verifyToken');
const Delete = require('../controller/eventController');

router.delete('/doctors/:id', verifyAdmin, Delete.deleteDoctorById);
router.delete('/patient/:id', verifyToken, Delete.deletePatientById);
router.delete('/appointment/:id', verifyAdmin, Delete.deleteAppointmentById);
router.delete('/contact/:id', verifyAdmin, Delete.deleteContactById);
router.delete('/visit', Delete.deleteVisit);

module.exports = router;