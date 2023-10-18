import fs from "fs";
import path from "path";
import axios from "axios";
import Healthcare from "../models/healthcare.model.js";

// Get all healthcare entities
export const getAllHealthcare = async (req, res) => {
  try {
    const healthcareEntities = await Healthcare.find();
    res.json(healthcareEntities);
  } catch (error) {
    console.error("Error fetching healthcare entities:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Create a new healthcare entity with image URL(s)
// Import necessary modules and models

// Create a new healthcare entity with image URL(s) and emailId
export const createHealthcare = async (req, res) => {
  const {
    name,
    categories,
    city,
    fulladdress,
    timings,
    contactnumber,
    about,
    speciality,
    images, // Array of image URLs
    emailId,
  } = req.body;

  const newHealthcare = new Healthcare({
    name,
    categories,
    city,
    fulladdress,
    timings,
    contactnumber,
    about,
    speciality,
    emailId, // Include emailId
  });

  if (images && images.length > 0) {
    newHealthcare.images = images;
  }

  try {
    const savedHealthcare = await newHealthcare.save();
    res.status(201).json(savedHealthcare);
  } catch (error) {
    console.error("Error saving healthcare entity:", error);
    res.status(500).json({ message: "Error saving healthcare entity" });
  }
};

// Update a healthcare entity with image URL(s) and emailId
export const updateHealthcare = async (req, res) => {
  const { id } = req.params;
  try {
    const healthcare = await Healthcare.findById(id);

    if (!healthcare) {
      return res.status(404).json({ message: "Healthcare entity not found" });
    }

    const {
      name,
      categories,
      city,
      fulladdress,
      timings,
      contactnumber,
      about,
      speciality,
      images, // Array of image URLs
      emailId,
    } = req.body;

    if (name) healthcare.name = name;
    if (categories) healthcare.categories = categories;
    if (city) healthcare.city = city;
    if (fulladdress) healthcare.fulladdress = fulladdress;
    if (timings) healthcare.timings = timings;
    if (contactnumber) healthcare.contactnumber = contactnumber;
    if (about) healthcare.about = about;
    if (speciality) healthcare.speciality = speciality;
    if (emailId) healthcare.emailId = emailId; // Include emailId

    if (images && images.length > 0) {
      healthcare.images = images;
    }

    const updatedHealthcare = await healthcare.save();
    res.json(updatedHealthcare);
  } catch (error) {
    console.error("Error updating healthcare entity:", error);
    res.status(500).json({ message: "Error updating healthcare entity" });
  }
};

// Delete a healthcare entity
export const deleteHealthcare = async (req, res) => {
  const { id } = req.params;
  try {
    await Healthcare.findByIdAndDelete(id);
    res.json({ message: "Healthcare entity deleted successfully" });
  } catch (error) {
    console.error("Error deleting healthcare entity:", error);
    res.status(500).json({ message: "Error deleting healthcare entity" });
  }
};

// Get a specific healthcare entity by ID
export const getHealthcareById = async (req, res) => {
  const { id } = req.params;
  try {
    const healthcareEntity = await Healthcare.findById(id);
    if (!healthcareEntity) {
      return res.status(404).json({ message: "Healthcare entity not found" });
    }
    res.json(healthcareEntity);
  } catch (error) {
    console.error("Error fetching healthcare entity:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getHealthcareByCity = async (req, res) => {
  const { city } = req.params;
  try {
    const healthcareEntities = await Healthcare.find({ city });
    res.json(healthcareEntities);
  } catch (error) {
    console.error("Error fetching healthcare entities by city:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const uploadAndImportExcel = async (req, res) => {
  const jsonData = req.body; // Assuming your JSON data is in the request body

  try {
    // Save the JSON data to the MongoDB database
    const savedData = await Healthcare.create(jsonData);

    // Respond with the saved data
    res.status(201).json({ savedData });
  } catch (error) {
    console.error("Error saving data:", error);
    res.status(500).json({ message: "Error saving data" });
  }
};
