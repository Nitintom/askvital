import mongoose from "mongoose";

const accountSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
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
    phoneNumber: {
      type: String,
    },
    profilePicture: {
      type: String,
      default: "https://example.com/default-profile.jpg",
    },
    role: {
      type: String,
      default: "user",
    },
  },
  {
    timestamps: true,
    indexes: [{ unique: true, fields: ["email"] }],
  }
);

const Account = mongoose.model("Account", accountSchema);

export default Account;
