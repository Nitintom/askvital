import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";

// ... (your existing code)

export const signup = async (req, res, next) => {
  console.log("Signup request received");

  const { fullName, email, password, phoneNumber } = req.body;

  try {
    const hashedPassword = bcryptjs.hashSync(password, 10);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      phoneNumber,
      role: "user",
    });

    console.log("Attempting to save new user:", newUser);

    const savedUser = await newUser.save();

    console.log("User created successfully:", savedUser);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: savedUser,
    });
  } catch (error) {
    console.error("Error during signup:", error);

    // Check if the error is a duplicate key error on the email field
    if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
      console.log("Duplicate email detected");
      return res.status(400).json({
        success: false,
        message: "Email already exists. Please use a different email.",
      });
    }

    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const validUser = await User.findOne({ email });

    if (!validUser) {
      return next(errorHandler(404, "User not found"));
    }

    const validPassword = bcryptjs.compareSync(password, validUser.password);

    if (!validPassword) {
      return next(errorHandler(401, "Wrong credentials"));
    }

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);

    if (!token) {
      console.log("Token not generated.");
    }

    console.log("Generated token:", token);

    // Set the token in the response cookie
    res.cookie("access_token", token, { httpOnly: true });

    const { password: hashedPassword, ...userData } = validUser._doc;

    res.status(200).json(userData);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, "You can update only your account!"));
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          fullName: req.body.fullName,
          email: req.body.email,
          phoneNumber: req.body.phoneNumber,
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

export const adminRoute = async (req, res, next) => {
  try {
    const users = await User.find({}, "-password");
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const deleteUserByAdmin = async (req, res, next) => {
  try {
    const userIdToDelete = req.params.id;
    await User.findByIdAndDelete(userIdToDelete);
    res.status(200).json("User has been deleted by admin.");
  } catch (error) {
    next(error);
  }
};
