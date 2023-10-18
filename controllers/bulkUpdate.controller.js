import xlsx from "xlsx";
import fs from "fs";
import axios from "axios";
import multer from "multer";
import Healthcare from "../models/healthcare.model.js"; // Adjust the path as needed

// Configure Multer middleware for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (file.fieldname !== "excelFile") {
      return cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE"));
    }
    cb(null, true);
  },
}).single("excelFile");

// Import Excel data to MongoDB
async function importExcelData2MongoDB(filePath) {
  try {
    const excelData = await xlsx.readFile(filePath.path);
    const sheetName = excelData.SheetNames[0];
    const sheet = excelData.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

    for (const row of data) {
      const [
        name,
        categories,
        city,
        fullAddress,
        imageUrl,
        review,
        about,
        timings,
        contactNumber,
        speciality,
      ] = row;

      // Download the image from the URL
      const imageResponse = await axios.get(imageUrl, {
        responseType: "arraybuffer",
      });

      // Create a new healthcare entity
      const newHealthcare = new Healthcare({
        name,
        categories,
        city,
        fulladdress: fullAddress, // Adjust the field name based on your model
        images: [
          {
            data: Buffer.from(imageResponse.data), // Convert image data to Buffer
            contentType: "image/*", // Change the content type as needed
          },
        ],
        reviews: [
          {
            qualityRating: review, // Modify this based on your model structure
            compassionRating: review, // Modify this based on your model structure
            cleanlinessRating: review, // Modify this based on your model structure
            efficiencyRating: review, // Modify this based on your model structure
          },
        ],
        about,
        timings,
        contactnumber: contactNumber, // Adjust the field name based on your model
        speciality,
      });

      // Save the entity to the database
      await newHealthcare.save();
    }

    // Clean up - remove the uploaded Excel file
    fs.unlinkSync(filePath.path);
  } catch (err) {
    console.error("Error importing data to MongoDB:", err);
    throw err;
  }
}

// Controller function for handling file upload and data import
export const uploadAndImportExcel = async (req, res) => {
  try {
    const uploadPromise = new Promise((resolve, reject) => {
      upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
          console.error("Multer error:", err);
          reject("File upload error.");
        } else if (err) {
          console.error("Unknown error:", err);
          reject("Internal Server Error");
        } else {
          resolve(req.file);
        }
      });
    });

    const file = await uploadPromise;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    try {
      await importExcelData2MongoDB(file);
      res.json({
        message: "File Uploaded and Data Imported",
        file: file.originalname,
      });
    } catch (error) {
      console.error("Error during data import:", error);
      res.status(500).json({ message: "Error during data import." });
    }
  } catch (error) {
    console.error("Error during file upload:", error);
    res.status(500).json({ message: "Error during file upload." });
  }
};
