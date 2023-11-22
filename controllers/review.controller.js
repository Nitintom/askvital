import mongoose from "mongoose";
import Healthcare from "../models/healthcare.model.js";

// Create a new review associated with a healthcare entity
export const createReview = async (req, res) => {
  try {
    const {
      qualityRating,
      compassionRating,
      cleanlinessRating,
      efficiencyRating,
      costRange,
      review,
      userName, // Add userName
    } = req.body;

    // Get the healthcare entity ID from the request parameters
    const { id } = req.params;

    // Find the healthcare entity by its ID
    const healthcareEntity = await Healthcare.findById(id);

    if (!healthcareEntity) {
      return res.status(404).json({ error: "Healthcare entity not found." });
    }

    // Create a new review object
    const newReview = {
      qualityRating,
      compassionRating,
      cleanlinessRating,
      efficiencyRating,
      costRange,
      review,
      userName, // Add userName
    };

    // Push the new review to the healthcare entity's reviews array
    healthcareEntity.reviews.push(newReview);

    // Save the updated healthcare entity
    const updatedHealthcareEntity = await healthcareEntity.save();

    res.status(201).json(updatedHealthcareEntity);
  } catch (error) {
    console.error("Error creating review:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the review" });
  }
};

// Get all reviews of a healthcare entity
export const getAllReviews = async (req, res) => {
  try {
    const { id } = req.params; // Get the healthcare entity ID from the request parameters
    const healthcareEntity = await Healthcare.findById(id);

    if (!healthcareEntity) {
      return res.status(404).json({ error: "Healthcare entity not found." });
    }

    const reviews = healthcareEntity.reviews;
    res.status(200).json(reviews);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching reviews." });
  }
};

// Get a single review by ID
export const getReviewById = async (req, res) => {
  try {
    const { id, reviewId } = req.params; // Get the healthcare entity ID and review ID from the request parameters
    const healthcareEntity = await Healthcare.findById(id);

    if (!healthcareEntity) {
      return res.status(404).json({ error: "Healthcare entity not found." });
    }

    const review = healthcareEntity.reviews.id(reviewId);
    if (!review) {
      return res.status(404).json({ error: "Review not found." });
    }
    res.status(200).json(review);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching the review." });
  }
};

// Update a review by ID
export const updateReviewByNameAndId = async (req, res) => {
  try {
    const { name: healthcareEntityName, reviewId } = req.params;
    const updatedFields = req.body;

    // Check if reviewId is a valid ObjectId before querying the database
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({ error: "Invalid reviewId." });
    }

    const healthcareEntity = await Healthcare.findOne({
      name: healthcareEntityName,
    });

    if (!healthcareEntity) {
      return res.status(404).json({ error: "Healthcare entity not found." });
    }

    const review = healthcareEntity.reviews.id(reviewId);

    if (!review) {
      return res.status(404).json({ error: "Review not found." });
    }

    // Update the review object
    review.set(updatedFields);

    const updatedHealthcareEntity = await healthcareEntity.save();

    // Send only the relevant data back to the client
    const { _id, name, reviews } = updatedHealthcareEntity;
    const responseData = { _id, name, reviews };

    res.status(200).json(responseData);
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteReviewByNameAndId = async (req, res) => {
  try {
    const { name: healthcareEntityName, reviewId } = req.params;

    // Check if reviewId is a valid ObjectId before querying the database
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({ error: "Invalid reviewId." });
    }

    const healthcareEntity = await Healthcare.findOne({
      name: healthcareEntityName,
    });

    if (!healthcareEntity) {
      return res.status(404).json({ error: "Healthcare entity not found." });
    }

    const reviewIndex = healthcareEntity.reviews.findIndex(
      (review) => review._id.toString() === reviewId
    );

    if (reviewIndex === -1) {
      return res.status(404).json({ error: "Review not found." });
    }

    // Remove the review from the array
    healthcareEntity.reviews.splice(reviewIndex, 1);

    const updatedHealthcareEntity = await healthcareEntity.save();

    // Send only the relevant data back to the client
    const { _id, name, reviews } = updatedHealthcareEntity;
    const responseData = { _id, name, reviews };

    res.status(200).json(responseData);
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
