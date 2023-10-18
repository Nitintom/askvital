import mongoose from "mongoose";
const businessSubmissionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    category: {
      type: String,
      enum: ["hospital", "clinic", "pharmacy", "lab"],
    },
    city: {
      type: String,
    },
    fulladdress: {
      type: String,
    },
    timings: String,
    contactnumber: String,
    about: String,
    speciality: String,
    status: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Approved", "Denied"],
    },
    images: [
      {
        imageUrl: {
          type: String,
        },
      },
    ],
    // You can add more fields as needed for business submissions
  },
  { timestamps: true }
);

const BusinessSubmission = mongoose.model(
  "BusinessSubmission",
  businessSubmissionSchema
);

export default BusinessSubmission;
