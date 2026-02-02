import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowerCase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});

/**
 * Compares the given password to the user's stored password.
 * @param {string} password - The password to be compared.
 * @returns {Promise<boolean>} - True if the password matches, false otherwise.
 */
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

/**
 * Generates an access token for the user.
 * The access token contains the user's id and email.
 * The access token is signed with the ACCESS_TOKEN_SECRET
 * and expires after the ACCESS_TOKEN_EXPIRY period.
 * @returns {string} the access token
 */
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY },
  );
};

const User = mongoose.model("User", userSchema);

export default User;
