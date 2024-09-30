const { uploadUserAvatar } = require("../../middleware/multerConfig");
const Doctor = require('../../model/doctor'); // Adjust the path as necessary

const createDoctor = async (req, res) => {
  uploadUserAvatar(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    
    try {
      const {
        first_Name,
        last_Name,
        country,
        city,
        is_Admin,
        birthdate,
        qualification,
        experience,
        specialization,
        description,
        phone,
        gender,
        workTime,
        email,
        password,
      } = req.body;

      const parsedBirthDate = new Date(birthdate);

      if (!isEmailStartsWithDr(email)) {
        return res.status(400).json({
          message: "Email is not valid; email for doctor must be like dr.doctorname@example.com",
        });
      }

      const doctorData = new Doctor({
        first_Name,
        last_Name,
        country,
        city,
        avatar: req.file ? req.file.filename : null,
        is_Admin,
        birthdate: parsedBirthDate,
        qualification,
        experience,
        specialization,
        description,
        gender,
        workTime,
        phone,
        email,
        password, // This will be hashed by the schema pre-save hook
      });

      await doctorData.save();

      res.status(201).json({ message: "Doctor created successfully" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
};

function isEmailStartsWithDr(email) {
  const regex = /^dr\./i;
  return regex.test(email);
}

module.exports = createDoctor;
