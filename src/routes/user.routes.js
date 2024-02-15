import { Router } from "express";
import {
    ChangeCurrentPassword,
    RefreshAccessToken,
    getCurrentUser,
    getUserChannelProfile,
    getWatchHistory,
    loginUSer,
    logoutUser,
    registerUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
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
router.route("/change-password").post(verifyJwt, ChangeCurrentPassword);
router.route("/Current-user").get(verifyJwt, getCurrentUser);
router.route("/Update-details").patch(verifyJwt, updateAccountDetails);
router
    .route("/avatar")
    .patch(verifyJwt, upload.single("avatar"), updateUserAvatar);
router
    .route("/CoverImage")
    .patch(verifyJwt, upload.single("coverImage"), updateUserCoverImage);

router.route("/c/:username").get(verifyJwt, getUserChannelProfile);
router.route("/watch-history").get(verifyJwt, getWatchHistory);

// export the router to be used in the server file
export default router;
