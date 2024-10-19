const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const doctorSchema = new mongoose.Schema({
  first_Name: {
    type: String,
    required: true,
    minlength: 3,
  },
  last_Name: {
    type: String,
    required: true,
    minlength: 3,
  },
  country: {
    type: String,
  },
  city: {
    type: String,
  },
  avatar: {
    type: String,
  },
  gender: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "doctor",
  },
  birthdate: {
    type: Date,
  },
  qualification: {
    type: String,
  },
  experience: {
    type: String,
  },
  specialization: {
    type: String,
  },
  description: {
    type: String,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  StartTime: {
    type: String,
    required: true,
    match: /^([01]\d|2[0-3]):([0-5]\d)$/,
  },
  EndTime: {
    type: String,
    required: true,
    match: /^([01]\d|2[0-3]):([0-5]\d)$/,
  },
  DaysWork: {
    type: Array,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Pre-save hook for password hashing
doctorSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    } catch (err) {
      next(err);
    }
  } else {
    next();
  }
});

module.exports = mongoose.model("doctor", doctorSchema);


/*

{"_id":{"$oid":"66f5897c2ac9f3ccb7172114"},
"first_Name":"Ahmad",
"last_Name":"Saleh",
"country":"Palstine",
"city":"Biddya",
"avatar":null,
"is_Admin":true,
"birthdate":{"$date":{"$numberLong":"1032987600000"}},
"qualification":"Aha1",
"experience":"Aha2",
"specialization":"Aha3",
"description":"Desc",
"phone":"0599999900",
"email":"dr.ahmad@gmail.com",
"password":"$2b$10$3tiaZ/JnLTLEwDNQ2HGsK.xiM2mw/JwN2dpT2RhrVZZK0qC73rz/m",
"createdAt":{"$date":{"$numberLong":"1727367548637"}},
"__v":{"$numberInt":"0"}}

*/