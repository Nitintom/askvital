import Review from "../models/healthcare.model.js"; // Import the Review model
import Healthcare from "../models/healthcare.model.js"; // Import the Healthcare model

// Create a new review
export const createReview = async (req, res) => {
  try {
    const {
      qualityRating,
      compassionRating,
      cleanlinessRating,
      efficiencyRating,
      costRange,
      review,
      user,
    } = req.body;

    // Get the healthcare entity ID from the request parameters
    const { id } = req.params; // Correct variable name

    // Find the healthcare entity by its ID
    const healthcareEntity = await Healthcare.findById(id); // Correct variable name

    if (!healthcareEntity) {
      return res.status(404).json({ error: "Healthcare entity not found." });
    }

    // Create a new review associated with the healthcare entity
    const newReview = new Review({
      qualityRating,
      compassionRating,
      cleanlinessRating,
      efficiencyRating,
      costRange,
      review,
      user,
    });

    // Push the new review to the healthcare entity's reviews array
    healthcareEntity.reviews.push(newReview);

    // Save the updated healthcare entity
    const updatedHealthcareEntity = await healthcareEntity.save();

    res.status(201).json(updatedHealthcareEntity);
  } catch (error) {
    console.error("Error creating review:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the review", error });
  }
};

// Get all reviews
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find();
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
    const { id } = req.params;
    const review = await Review.findById(id);
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
export const updateReviewById = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedReview = await Review.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedReview) {
      return res.status(404).json({ error: "Review not found." });
    }
    res.status(200).json(updatedReview);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while updating the review." });
  }
};

// Delete a review by ID
export const deleteReviewById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedReview = await Review.findByIdAndRemove(id);
    if (!deletedReview) {
      return res.status(404).json({ error: "Review not found." });
    }
    res.status(200).json(deletedReview);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while deleting the review." });
  }
};
