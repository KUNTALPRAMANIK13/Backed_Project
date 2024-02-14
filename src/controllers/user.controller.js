import { asynchandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "./../models/user.model.js";
import { UploadOnCloudinary } from "../utils/Cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
const registerUser = asynchandler(async (req, res) => {
  // get user Details
  //validation - not empty
  // check if use already exist : usernamae ,email
  //check for avatar,image
  // upload them to couldinary
  // create user object - create user object entry in db
  // remove password and response token field from response
  //check for user creation
  // return res

  const { username, email, password, fullName } = req.body;

  // console.log("Request Body->", req.body);
  if (
    [username, email, password, fullName].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existing_user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existing_user) {
    throw new ApiError(409, "User with username or email already exists");
  }

  // console.log("Request File->", req.files);

  const avatarlocalpath = req.files?.avatar[0]?.path;
  // const cover_imagelocalpath = req.files?.coverImage[0]?.path;

  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarlocalpath) {
    throw new ApiError(400, "avatar file is required");
  }

  const avatar = await UploadOnCloudinary(avatarlocalpath);
  const coverImage = await UploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "avatar file is required");
  }

  const user = await User.create({
    username: username.toLowerCase(),
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
  });

  const created_user = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!created_user) {
    throw new ApiError(500, "Something get wrong while Registering User");
  }
  return res
    .status(201)
    .json(new ApiResponse(200, created_user, "User registered successfully"));
});

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError("500", "something went wrong while generating tokens");
  }
};
const loginUSer = asynchandler(async (req, res) => {
  // reqbody->data
  // username or email
  // find user
  // password check
  // access token and refresh token
  // send cookies

  const { email, username, password } = req.body;

  if (!username && !email) {
    throw new ApiError(400, "Email or username field is missing");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "user does not exist");
  }
  const validPassword = await user.isPasswordCorrect(password);

  if (!validPassword) {
    throw new ApiError(401, "invalid user credentials");
  }
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const option = {
    httpOnly: true,
    secure: true,
    // sameSite: "Lax",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, option)
    .cookie("refreshToken", refreshToken, option)
    .json(
      new ApiResponse(
        200,
        {
          userData: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User Logged In Successfully"
      )
    );
});

const logoutUser = asynchandler(async (req, res) => {
  // console.log(req.user);
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );
  const option = {
    httpOnly: true,
    secure: true,
    // sameSite: "Lax",
  };
  return res
    .status(200)
    .clearCookie("accessToken", option)
    .clearCookie("refreshToken", option)
    .json(new ApiResponse(200, {}, "User Logged Out Successfully"));
});

const RefreshAccessToken = asynchandler(async (req, res) => {
  const incomingRefreshToken =
    req.body.refreshToken || req.cookies.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized Request");
  }

  try {
    const DecodeToken = jwt.verify(
      incomingRefreshToken,
      process.env.Refresh_Token_Secret
    );
    const user = await User.findOne(DecodeToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid Refresh Token");
    }
    if (user?.refreshToken !== incomingRefreshToken) {
      throw new ApiError(401, "Invalid Refresh Token Expired or used");
    }
    const option = {
      httpOnly: true,
      secure: true,
      // sameSite: "Lax",
    };
    const { accessToken, newrefreshToken } =
      await generateAccessAndRefreshTokens(user._id);
    return res
      .status(200)
      .cookie("accessToken", accessToken, option)
      .cookie("refreshToken", newrefreshToken, option)
      .json(
        new ApiResponse(
          200,
          {
            accessToken,
            refreshToken: newrefreshToken,
          },
          "Access Token Refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Refresh Token");
  }
});
export { registerUser, loginUSer, logoutUser, RefreshAccessToken };
