const express = require("express");
const Doctor = require("../model/doctor");
const Patient = require("../model/patient");
const Contacting = require("../model/contacting");
const Appointment = require("../model/appointment");
const Medication = require("../model/medication");
const uploadUserAvatar = require("../middleware/multerConfig");

/*
    Insert Data
*/
module.exports.addContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    const newContact = new Contacting({
      name,
      email,
      phone,
      subject,
      message,
      createdAt: new Date(), // Set to current UTC time
    });
    await newContact.save();
    res
      .status(200)
      .json({ message: "Data inserted successfully", result: newContact });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports.addAppointment = async (req, res) => {
  try {
    const { doctor_id, patient_id, details, appDate } = req.body;
    const newAppointment = new Appointment({
      doctor_id,
      patient_id,
      date: appDate,
      details,
      createdAt: new Date(), 
    });
    await newAppointment.save();
    res
      .status(200)
      .json({ message: "Data inserted successfully", result: newAppointment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports.addMedication = async (req, res) => {
  try {
    const { doctor_id, patient_id, cash, date, status, note, description } = req.body;

    

    const newMedication = new Medication({
      doctor_id,
      patient_id,
      cash,
      date,
      status,
      note,
      description,
    });
    await newMedication.save();
    res
      .status(200)
      .json({ message: "Data inserted successfully", result: newMedication });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/*
delete data
*/
module.exports.deleteDoctorById = async (req, res) => {
  try {
    const { id } = req.params; // Getting id from URL params
    await Doctor.findByIdAndDelete(id);
    res.status(200).json({ message: "Doctor deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports.deletePatientById = async (req, res) => {
  try {
    const { id } = req.body;
    await Patient.findByIdAndDelete(id);
    res.status(200).json({ message: "Data deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports.deleteAppointment = async (req, res) => {
  try {
    const { id } = req.body;
    await Appointment.findByIdAndDelete(id);
    res.status(200).json({ message: "Data deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports.deleteContact = async (req, res) => {
  try {
    const { id } = req.body;
    await Contacting.findByIdAndDelete(id);
    res.status(200).json({ message: "Data deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/*
    Update Data
*/
module.exports.updateDoctorById = async (req, res) => {
  uploadUserAvatar(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      const { id } = req.body;
      let updateData = req.body;

      if (req.file) {
        updateData.avatar = req.file.filename;
      }

      const updatedDoctor = await Doctor.findByIdAndUpdate(id, updateData, {
        new: true,
      });

      res
        .status(200)
        .json({ message: "Data updated successfully", result: updatedDoctor });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
};

module.exports.updatePatientById = async (req, res) => {
  try {
    const { id, data } = req.body;
    const updatedPatient = await Patient.findByIdAndUpdate(id, data, {
      new: true,
    });
    res
      .status(200)
      .json({ message: "Data updated successfully", result: updatedPatient });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports.updateMedication = async (req, res) => {
  try {
    const { id, data } = req.body;
    const updatedMedication = await Medication.findByIdAndUpdate(id, data, {
      new: true,
    });
    res
      .status(200)
      .json({
        message: "Data updated successfully",
        result: updatedMedication,
      });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
