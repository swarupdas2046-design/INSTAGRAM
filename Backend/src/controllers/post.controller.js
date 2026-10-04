import sendFile from "../config/imagekit.js";
import { postModel } from "../models/post.model.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const PostController = asyncHandler(async (req, res) => {
  const User = req.user;
  const { buffer, originalname } = req.file;

  const { caption } = req.body;

  const data = await sendFile(buffer, originalname);

  if (!data) throw new ApiError("Image Upload Failed", 500);

  const post = await postModel.create({
    user: User._id,
    caption,
    imageUrl: { url: data.url, fieldId: data.fileId },
  });

  return res
    .status(200)
    .json(new ApiResponse("Image Arrived SuccessFully", post));
});
