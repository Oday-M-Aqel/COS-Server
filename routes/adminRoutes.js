const express = require("express");
const verifyAdmin = require("../middleware/verifyAdminToken");
const router = express.Router();
const adminController = require("../controller/admin/adminController");
const addDoctor = require("../controller/admin/addDoctor");

router.post("/add-doctor", verifyAdmin, addDoctor);

router.put(
  "/update-doctor/:doctorId",
  verifyAdmin,
  adminController.updateDoctorById
);
router.put(
  "/update-patient/:patientId",
  verifyAdmin,
  adminController.updatePatientById
);

router.get(
  "/get-doctor/:doctorId",
  verifyAdmin,
  adminController.getDoctorById
);
router.get(
  "/get-patient/:patientId",
  verifyAdmin,
  adminController.getPatientById
);

router.get(
  "/get-doctors/:page/:limit",
  verifyAdmin,
  adminController.getDoctors
);
router.get(
  "/get-patients/:page/:limit",
  verifyAdmin,
  adminController.getPatients
);
router.get(
  "/get-appointments/:page/:limit",
  verifyAdmin,
  adminController.getAppointment
);
router.get(
  "/get-medications/:page/:limit",
  verifyAdmin,
  adminController.getMedication
);

router.delete(
  "/delete-doctor/:doctorId",
  verifyAdmin,
  adminController.deleteDoctorById
);
router.delete(
  "/delete-patient/:patientId",
  verifyAdmin,
  adminController.deletePatientById
);

router.patch(
  "/increase-banned/:patientId",
  verifyAdmin,
  adminController.increaseBannedPatient
);

router.put(
  "/upgrade-patient/:patientId",
  verifyAdmin,
  adminController.upgradePatientToAdmin
);

module.exports = router;
