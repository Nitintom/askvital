import BusinessSubmission from "../models/businessSubmissionModel.js";
import fs from "fs/promises"; // Use fs.promises to handle file operations
import multer from "multer";
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
    } = req.body;

    // Assuming you have received an image URL from the frontend (imgbb API or elsewhere)
    const imageUrl = req.body.image;

    if (!imageUrl) {
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
      images: [
        {
          imageUrl: imageUrl, // Set the URL of the uploaded image
        },
      ],
    });

    newSubmission.status = "Pending";

    await newSubmission.save();
    notifyAdmin(newSubmission);

    const pendingNotifications = getPendingNotifications();

    res.status(201).json({
      message: "Business submission received and pending approval.",
      pendingNotifications,
    });
  } catch (error) {
    console.error("Error submitting business:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

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
