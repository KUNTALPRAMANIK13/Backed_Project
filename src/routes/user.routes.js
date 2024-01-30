import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "./../middlewares/multer.middleware.js";
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
// router.route("/register").post(registerUser);

// export the router to be used in the server file
export default router;

// router.post("/register", registerUser);
// export default router;
