import sendFile from "../config/imagekit.js";
import likeModel from "../models/like.model.js";
import { postModel } from "../models/post.model.js";
import ApiError from "../utils/apiError.js";

export const PostService = async (User, file, caption) => {
  if (!file) throw new ApiError("Image is required", 400);

  const data = await sendFile(file.buffer, file.originalname, "posts");

  if (!data) throw new ApiError("Image Upload Failed", 500);

  const post = await postModel.create({
    user: User._id,
    caption,
    imageUrl: { url: data.url, fieldId: data.fileId },
  });

  return post;
};

export const allPostService = async (user) => {
  console.log(user);

  const allPosts = await postModel.find({ user: user._id });

  if (!allPosts) throw new ApiError("Posts not found", 404);

  console.log(allPosts);

  return allPosts;
};

export const postDetailsService = async (postId, user) => {
  if (!postId) throw new ApiError("post not found", 404);

  const data = await postModel.findById(postId);

  if (!data) throw new ApiError("Post not found", 404);

  //-----------------check if the user is the owner of the post through equal method---------------------

  const isValid = data.user.equals(user._id);

  if (!isValid) throw new ApiError("forbidden access", 403);

  return data;
};

export const likePostService = async (postId, user) => {
  const post = await postModel.findById(postId);

  if (!post) throw new ApiError("Post not found", 404);

  const isLiked = await likeModel.findOne({
    post: postId,
    user: user,
  });

  if (isLiked) throw new ApiError("You have already liked this post", 200);

  const like = await likeModel.create({
    post: postId,
    user: user,
  });

  return like;
};
