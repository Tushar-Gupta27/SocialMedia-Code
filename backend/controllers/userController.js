import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const signInUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser)
      return res.status(404).json({ message: "User doesnt Exists" });
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid Credentials" });

    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id }, //data to be included in token
      "test", //secret key
      { expiresIn: "1h" } //options can be seen
    );
    res.status(200).json({ profile: existingUser, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
export const signUpUser = async (req, res) => {
  const { email, password, firstName, lastName, confirmPassword } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already Exists" });
    if (!password === confirmPassword)
      return res.status(400).json({ message: "Passwords dont match" });

    const hashedPassword = await bcrypt.hash(password, 12);
    //can create in this way also a new entry to DB
    const result = await User.create({
      email,
      password: hashedPassword,
      name: `${firstName} ${lastName}`,
    });

    const token = jwt.sign({ email: result.email, id: result._id }, "test", {
      expiresIn: "1h",
    });
    res.status(201).json({ profile: result, token: token });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};
