import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  qualityRating: Number,
  compassionRating: Number,
  cleanlinessRating: Number,
  efficiencyRating: Number,
  costRange: String,
  review: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
});

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
    reviews: [reviewSchema],
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
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
    emailId: {
      type: String, // You can define the type as String
    },
  },
  { timestamps: true }
);

const Healthcare = mongoose.model("Healthcare", healthcareSchema);

export default Healthcare;
