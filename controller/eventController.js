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
    const { doctor_id, patient_id, details, date, time } = req.body;

    const FoundDoctor = await Doctor.findOne({ _id: doctor_id });

    if (!FoundDoctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    if (!FoundDoctor.DaysWork || !Array.isArray(FoundDoctor.DaysWork)) {
      return res.status(500).json({ message: "Doctor's DaysWork is undefined or invalid" });
    }

    const appointmentDate = new Date(date);
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const appointmentDay = dayNames[appointmentDate.getDay()];

    if (!FoundDoctor.DaysWork.includes(appointmentDay)) {
      return res.status(400).json({ message: `Doctor is not available on ${appointmentDay}` });
    }

    const [appointmentHour, appointmentMinute] = time.split(':').map(Number);
    const appointmentTimeInMinutes = appointmentHour * 60 + appointmentMinute;

    const [startHour, startMinute] = FoundDoctor.StartTime.split(':').map(Number);
    const [endHour, endMinute] = FoundDoctor.EndTime.split(':').map(Number);
    const startTimeInMinutes = startHour * 60 + startMinute;
    const endTimeInMinutes = endHour * 60 + endMinute;

    if (appointmentTimeInMinutes < startTimeInMinutes || appointmentTimeInMinutes > endTimeInMinutes) {
      return res.status(400).json({ message: `Appointment time is outside the doctor's working hours` });
    }

    const fifteenMinutes = 14;
    const timeRangeStart = appointmentTimeInMinutes - fifteenMinutes;
    const timeRangeEnd = appointmentTimeInMinutes + fifteenMinutes;

    const existingAppointment = await Appointment.findOne({
      doctor_id,
      date,
      $expr: {
        $and: [
          {
            $gte: [
              {
                $add: [
                  { $multiply: [{ $toInt: { $substr: ["$time", 0, 2] } }, 60] },
                  { $toInt: { $substr: ["$time", 3, 2] } }
                ]
              },
              timeRangeStart
            ]
          },
          {
            $lte: [
              {
                $add: [
                  { $multiply: [{ $toInt: { $substr: ["$time", 0, 2] } }, 60] },
                  { $toInt: { $substr: ["$time", 3, 2] } }
                ]
              },
              timeRangeEnd
            ]
          }
        ]
      }
    });

    if (existingAppointment) {
      return res.status(400).json({ message: "There is already an appointment within 15 minutes of the selected time." });
    }

    const newAppointment = new Appointment({
      doctor_id,
      patient_id,
      date: appointmentDate,
      time,
      details,
    });

    await newAppointment.save();
    res.status(200).json({ message: "Appointment created successfully", result: newAppointment });

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

module.exports.getMedication = async (req, res) => {
  try {
    const { doctor_id } = req.params;
    const medications = await Medication.find({ doctor_id })
      .populate('doctor_id', 'name')
      .populate('patient_id', 'name');

    if (!medications || medications.length === 0) {
      return res.status(404).json({ message: "No medications found for this doctor" });
    }

    res.status(200).json({ message: "Medications retrieved successfully", data: medications });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

