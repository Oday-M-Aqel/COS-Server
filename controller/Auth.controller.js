require("dotenv").config();
const { sign, verify } = require("jsonwebtoken");
const Patient = require("../model/patient");
const Doctor = require("../model/doctor");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
module.exports.signUp = async (req, res) => {
  try {
    const {
      first_Name,
      last_Name,
      birthdate,
      patient_id,
      gender,
      insurance,
      email,
      phone,
      password,
      chronic_diseases,
    } = req.body;
    console.log({
      first_Name,
      last_Name,
      birthdate,
      patient_id,
      gender,
      insurance,
      email,
      phone,
      password,
      chronic_diseases,
    })
    const userFound = await Patient.findOne({ email });
    if (userFound) {
      return res.status(404).json({ message: "Email is already in use" });
    }

    const dateOfBirth = birthdate.split('T')[0];

    const newPatient = new Patient({
      first_Name,
      last_Name,
      birthdate: dateOfBirth,
      patient_id,
      gender,
      insurance,
      email,
      phone,
      password, // Password will be hashed in the schema pre-save hook
      chronic_diseases,
    });

    await newPatient.save()
      .then(() => {
        res.status(200).json({ message: "Patient saved successfully" });
      })
      .catch((error) => {
        console.error('Error saving patient:', error); // Log the error
        res.status(500).json({ message: "Error saving patient" });
      });
  } catch (error) {
    console.error('Error during signup:', error); // Catch other errors
    res.status(500).json({ message: error.message });
  }
};


function isEmailStartsWithDr(email) {
  const regex = /^dr\./i;
  return regex.test(email);
}

module.exports.logIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const isDoctor = isEmailStartsWithDr(email);
    const UserModel = isDoctor ? Doctor : Patient;

    const foundUser = await UserModel.findOne({ email });

    if (!foundUser) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, foundUser.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    // Generate access and refresh tokens
    const accessToken = jwt.sign(
      { id: foundUser._id, email: foundUser.email, roles: foundUser.role },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      { id: foundUser._id, email: foundUser.email, roles: foundUser.role },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "1d" }
    );

    // Set the refresh token as a cookie
    res.cookie("cosToken", refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    // Send the response
    res.status(200).json({
      message: "Login successful",
      accessToken,
      userData: foundUser._id,
      userRole: foundUser.role,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports.refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies.cosToken;
    if (refreshToken) {
      verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
        if (err) {
          return res.status(406).json({ message: "Unauthorized" });
        } else {
          const accessToken = sign(
            { id: decoded.id, email: decoded.email, role: decoded.role },
            process.env.JWT_ACCESS_SECRET,
            { expiresIn: "1h" }
          );
          
          return res.status(200).json({
            message: "Token refreshed successfully",
            accessToken,
            userData: decoded.id,
            userRole: decoded.role,
          });
        }
      });
    } else {
      return res.status(406).json({ message: "Unauthorized" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports.logOut = (req, res) => {
  res.cookie("cosToken", null, {
    httpOnly: true,
    secure: true,
    maxAge: 1,
  });
  res.status(200).json({ message: "Logged out successfully" });
};
