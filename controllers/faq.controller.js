import Healthcare from "../models/healthcare.model.js";

// Create a new FAQ for a Healthcare Entity
export const createFAQ = async (req, res) => {
  try {
    const { id } = req.params; // Get the healthcare entity ID from the request parameters
    const { question, answer, userId } = req.body;

    // Find the healthcare entity by its ID
    const healthcareEntity = await Healthcare.findById(id);

    if (!healthcareEntity) {
      return res.status(404).json({ error: "Healthcare entity not found." });
    }

    // Add the new FAQ to the entity's FAQs
    healthcareEntity.faq.push({ question, answer, user: userId });

    // Save the updated healthcare entity
    const updatedHealthcareEntity = await healthcareEntity.save();

    res.status(201).json(updatedHealthcareEntity);
  } catch (error) {
    console.error("Error creating FAQ:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the FAQ", error });
  }
};

// Update an FAQ for a Healthcare Entity
export const updateFAQ = async (req, res) => {
  try {
    const { id, faqId } = req.params; // Get the healthcare entity ID and FAQ ID from the request parameters
    const { question, answer, userId } = req.body;

    // Find the healthcare entity by its ID
    const healthcareEntity = await Healthcare.findById(id);

    if (!healthcareEntity) {
      return res.status(404).json({ error: "Healthcare entity not found." });
    }

    // Find the FAQ within the healthcare entity's FAQs
    const faq = healthcareEntity.faq.id(faqId);

    if (!faq) {
      return res.status(404).json({ error: "FAQ not found." });
    }

    // Update the FAQ
    faq.question = question;
    faq.answer = answer;
    faq.user = userId;

    // Save the updated healthcare entity
    const updatedHealthcareEntity = await healthcareEntity.save();

    res.status(200).json(updatedHealthcareEntity);
  } catch (error) {
    console.error("Error updating FAQ:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the FAQ", error });
  }
};

// Get all FAQs for a Healthcare Entity
export const getAllFAQs = async (req, res) => {
  try {
    const { id } = req.params; // Get the healthcare entity ID from the request parameters

    // Find the healthcare entity by its ID
    const healthcareEntity = await Healthcare.findById(id);

    if (!healthcareEntity) {
      return res.status(404).json({ error: "Healthcare entity not found." });
    }

    // Retrieve the FAQs associated with the healthcare entity
    const faqs = healthcareEntity.faq;

    res.status(200).json(faqs);
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching FAQs", error });
  }
};
