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
    const { doctor_id, patient_id, cash, date, status, note, description } =
      req.body;

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
    const { id } = req.params;
    await Patient.findByIdAndDelete(id);
    res.status(200).json({ message: "Data deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports.deleteAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;
    await Appointment.findByIdAndDelete(id);
    res.status(200).json({ message: "Data deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports.deleteContactById = async (req, res) => {
  try {
    const { id } = req.params;
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
    res.status(200).json({
      message: "Data updated successfully",
      result: updatedMedication,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/*
Get Data:
*/

module.exports.getDoctors = async (req, res) => {
  try {
    const page = parseInt(req.params.page) || 1;
    const limit = parseInt(req.params.limit) || 8;
    const skip = (page - 1) * limit;
    const doctors = await Doctor.find({ role: "doctor" })
      .skip(skip)
      .limit(limit);

    if (doctors && doctors.length > 0) {
      return res.status(200).json(doctors);
    } else {
      console.log("Cannot Find");
      return res.status(404).json({ message: "Doctors not found" });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "Internal server error: " + err.message });
  }
};

module.exports.getAppointment = async (req, res) => {
  try {
    const page = parseInt(req.params.page) || 1;
    const limit = parseInt(req.params.limit) || 6;
    const skip = (page - 1) * limit;
    const appointments = await Appointment.find().skip(skip).limit(limit);

    if (appointments && appointments.length > 0) {
      return res.status(200).json(appointments);
    } else {
      console.log("Cannot Find");
      return res.status(404).json({ message: "Appointments not found" });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "Internal server error: " + err.message });
  }
};

module.exports.getPatients = async (req, res) => {
  try {
    const page = parseInt(req.params.page) || 1;
    const limit = parseInt(req.params.limit) || 4;
    const skip = (page - 1) * limit;
    const patients = await Patient.find().skip(skip).limit(limit);

    if (patients && patients.length > 0) {
      return res.status(200).json(patients);
    } else {
      console.log("Cannot Find");
      return res.status(404).json({ message: "Patients not found" });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "Internal server error: " + err.message });
  }
};

module.exports.searchDoctor = async (req, res) => {
  try {
    const { city, specialty } = req.body;
    const found = await Doctor.findOne({
      city: city,
      specialization: specialty,
    });

    if (!found) {
      console.log("Cannot Find");
      return res.status(404).json({ message: "Doctor doesn't founded" });
    }
    res.status(200).json(found);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "Internal server error" + err.message });
  }
};

module.exports.getContacts = async (req, res) => {
  try {
    const page = parseInt(req.params.page) || 1;
    const limit = parseInt(req.params.limit) || 6;
    const skip = (page - 1) * limit;
    const contacts = await Contact.find().skip(skip).limit(limit);

    if (contacts && contacts.length > 0) {
      return res.status(200).json(contacts);
    } else {
      console.log("Cannot Find");
      return res.status(404).json({ message: "Contacts not found" });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "Internal server error: " + err.message });
  }
};

module.exports.countDoctor = async (req, res) => {
  try {
    const doctorCount = await Doctor.countDocuments({ role: "doctor" });
    return res.status(200).json({ count: doctorCount });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error: " + err.message });
  }
};
