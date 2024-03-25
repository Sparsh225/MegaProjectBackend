import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudnary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
const registerUser = asyncHandler(async (req, res) => {
  //get user from frontend
  //validation-non empty
  //check if user already exists :username ,email,
  //check for images and avatar
  //upload them to cloudinary
  //create user object -creation create entry in db
  //remove password and refresh token field from response
  //check for user creation
  //return response

  const { email, fullname, username, password } = req.body;
  //console.log("email " + email);

  if (
    [fullname, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existeduser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existeduser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  const avatarLocalpath = req.files?.avatar[0]?.path;
  let coverImageLocalPath; //= req.files?.coverImage[0]?.path;

  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalpath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalpath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }

  const user = await User.create({
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshtoken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registring the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User Registered Successfully"));
});

export { registerUser };
