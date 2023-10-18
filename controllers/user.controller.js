import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";

export const signup = async (req, res, next) => {
  console.log("Signup request received"); // Add this line

  const { fullName, email, password, phoneNumber } = req.body;

  try {
    // Log the request body to check if required fields are present
    console.log("Received request body:", req.body);

    const hashedPassword = bcryptjs.hashSync(password, 10);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      phoneNumber, // Include phoneNumber in the user object
      role: "user", // Set the role as 'user' for regular signups
    });

    // Save the new user
    const savedUser = await newUser.save();

    // Log the saved user data
    console.log("User created successfully:", savedUser);

    // Send a success response with user data
    res
      .status(201)
      .json({ message: "User created successfully", user: savedUser });
  } catch (error) {
    // Log the error message for debugging
    console.error("Error during signup:", error);

    // Send an error response
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const validUser = await User.findOne({ email });

    if (!validUser) {
      return next(errorHandler(404, "User not found"));
    }

    // Check if the provided password matches the hashed password in the database
    const validPassword = bcryptjs.compareSync(password, validUser.password);

    if (!validPassword) {
      return next(errorHandler(401, "Wrong credentials"));
    }

    // If the user and password are valid, generate a JWT token
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);

    if (!token) {
      // Add a console log to check if the token is not generated
      console.log("Token not generated.");
    }

    // Log the generated token
    console.log("Generated token:", token);

    // Send the token as a cookie in the response
    res.cookie("access_token", token, { httpOnly: true });

    // Remove the password field from the user data before sending it in the response
    const { password: hashedPassword, ...userData } = validUser._doc;

    // Send the user data in the response
    res.status(200).json(userData);
  } catch (error) {
    // Handle errors and forward them to the error handler middleware
    next(error);
  }
};

// Update user
export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, "You can update only your account!"));
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          fullName: req.body.fullName, // Update Fullname
          email: req.body.email,
          phoneNumber: req.body.phoneNumber, // Update phoneNumber
          profilePicture: req.body.profilePicture,
        },
      },
      { new: true }
    );

    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
// Delete user
export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, "You can delete only your account!"));
  }

  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been deleted...");
  } catch (error) {
    next(error);
  }
};

// Admin-only Route
export const adminRoute = (req, res) => {
  res.status(200).json({ message: "This route is accessible by admins only." });
};
