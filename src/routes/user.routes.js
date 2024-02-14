import { Router } from "express";
import {
  RefreshAccessToken,
  loginUSer,
  logoutUser,
  registerUser,
} from "../controllers/user.controller.js";
import { upload } from "./../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);
router.route("/login").post(loginUSer);

// secured Routes
router.route("/logout").post(verifyJwt, logoutUser);

router.route("/RefreshToken").post(RefreshAccessToken);

// export the router to be used in the server file
export default router;
