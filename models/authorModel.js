const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const authorSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    pass: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  }
);
authorSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.pass);
};

// will encrypt password everytime its saved
authorSchema.pre("save", async function (next) {
  if (!this.isModified("pass")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.pass = await bcrypt.hash(this.pass, salt);
});

const User = mongoose.model("User", authorSchema);

module.exports = User;
