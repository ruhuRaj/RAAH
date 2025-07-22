const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const additionalDetailsSchema = new mongoose.Schema({
  gender: {
    type: String,
    enum: ["Male", "Female", "Other", "Prefer not to say"],
    default: "Prefer not to say",
  },
  dateOfBirth: Date,
  contactNumber: {
    type: String,
    trim: true,
  },
  address: {
    type: String,
    trim: true,
  },
  officerId: {
    type: String,
    trim: true,
  },
}, { _id: false, timestamps: true });

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true },
  accountType: {
    type: String,
    enum: ["Citizen", "District Magistrate", "Nodal Officers"],
    default: "Citizen",
    required: true,
  },
  active: { type: Boolean, default: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: "Department" }, // top-level
  image: String,
  token: String,
  resetPasswordExpires: Date,
  additionalDetails: additionalDetailsSchema,
  workProgress: [{ type: mongoose.Schema.Types.ObjectId, ref: "WorkProgress" }],
}, {
  timestamps: true,
});

// Hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Password check method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
