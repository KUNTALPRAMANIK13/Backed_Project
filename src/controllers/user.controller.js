import { asynchandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "./../models/user.model.js";
import { UploadOnCloudinary } from "../utils/Cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
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

export { registerUser };
