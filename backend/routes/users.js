import express from "express";
import { signInUser, signUpUser } from "../controllers/userController.js";
const router = express.Router();

router.post("/signin", signInUser);
router.post("/signup", signUpUser);
export default router;
