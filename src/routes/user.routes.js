import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";

const router = Router();

router.route("/register").post(registerUser);
// router.route("/register").post(registerUser);

// export the router to be used in the server file
export default router;

// router.post("/register", registerUser);
// export default router;
