import BusinessSubmission from "../models/businessSubmissionModel.js";
import Healthcare from "../models/healthcare.model.js";
import {
  notifyAdmin,
  removeNotificationById,
  notifyUser,
  getPendingNotifications,
} from "./notificationController.js";

export const submitBusiness = async (req, res) => {
  try {
    const {
      name,
      categories,
      city,
      fulladdress,
      contactnumber,
      timings,
      about,
      speciality,
      emailId,
      images, // Assuming images is an array of image URLs
    } = req.body;

    // Ensure that at least one image URL is provided
    if (!images || images.length === 0) {
      console.error("No image URL received");
      return res.status(400).json({ message: "Image URL is required" });
    }

    // Create a new business submission
    const newSubmission = new BusinessSubmission({
      name,
      categories,
      city,
      fulladdress,
      contactnumber,
      timings,
      about,
      speciality,
      emailId,
      images: images.map((imageUrl) => ({ imageUrl })), // Map image URLs to the required structure
    });

    newSubmission.status = "Pending";

    // Save the business submission
    await newSubmission.save();
    notifyAdmin(newSubmission);

    // Create a new healthcare entity using the business submission data
    const newHealthcare = new Healthcare({
      name,
      categories,
      city,
      fulladdress,
      timings,
      contactnumber,
      about,
      speciality,
      emailId,
      images: images.map((imageUrl) => ({ imageUrl })), // Map image URLs to the required structure
    });

    // Save the healthcare entity
    await newHealthcare.save();

    const pendingNotifications = getPendingNotifications();

    console.log(
      "Business submission and healthcare creation successful:",
      newSubmission,
      newHealthcare
    );
    console.log("Pending notifications:", pendingNotifications);

    res.status(201).json({
      message:
        "Business submission and healthcare creation received and pending approval.",
      pendingNotifications,
    });
  } catch (error) {
    console.error("Error submitting business:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ... (other controller functions)

export const getPendingSubmissions = async (req, res) => {
  try {
    const pendingSubmissions = await BusinessSubmission.find({
      status: "Pending",
    });
    res.json(pendingSubmissions);
  } catch (error) {
    console.error("Error retrieving pending submissions:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateSubmissionStatus = async (req, res) => {
  try {
    const { submissionId, status, notificationId } = req.body;

    if (!submissionId || !notificationId) {
      return res.status(400).json({
        message:
          "Submission ID or Notification ID is missing from the request.",
      });
    }

    const updatedSubmission = await BusinessSubmission.findByIdAndUpdate(
      submissionId,
      { status },
      { new: true }
    );

    if (!updatedSubmission) {
      return res.status(404).json({ message: "Submission not found." });
    }

    notifyUser(updatedSubmission);
    removeNotificationById(notificationId);

    res.json({ message: `Submission ${status}d successfully.` });
  } catch (error) {
    console.error("Error updating submission status:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteSubmission = async (req, res) => {
  try {
    const { submissionId } = req.body;

    if (!submissionId) {
      return res
        .status(400)
        .json({ message: "Submission ID is missing from the request." });
    }

    const deletedSubmission = await BusinessSubmission.findByIdAndDelete(
      submissionId
    );

    if (!deletedSubmission) {
      return res.status(404).json({ message: "Submission not found." });
    }

    res.json({ message: "Submission deleted successfully." });
  } catch (error) {
    console.error("Error deleting submission:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
