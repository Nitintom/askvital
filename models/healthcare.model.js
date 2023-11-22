import mongoose from "mongoose";

const healthcareSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
    },
    categories: {
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
    ratings: Number,
    reviews: [
      {
        qualityRating: Number,
        compassionRating: Number,
        cleanlinessRating: Number,
        efficiencyRating: Number,
        costRange: String,
        review: String,
        userName: String,
      },
    ],
    images: [
      {
        imageUrl: {
          type: String,
        },
      },
    ],
    faq: [
      {
        question: String,
        answer: String,
        userName: String,
      },
    ],
    emailId: {
      type: String,
    },
  },
  { timestamps: true }
);

const Healthcare = mongoose.model("Healthcare", healthcareSchema);

export default Healthcare;
