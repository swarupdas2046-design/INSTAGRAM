import { commentModel } from "../models/comment.model.js";
import { postModel } from "../models/post.model.js";
import ApiError from "../utils/apiError.js";

// ==============================================================================
// 💬 COMMENT SERVICE - INSTAGRAM CLONE
// ==============================================================================

/**
 * @desc Post par naya comment add karta hai
 * @param {string} postId - Post ki ObjectId
 * @param {string} userId - Comment karne wale user ki ObjectId
 * @param {string} text - Comment ka text content
 */
export const addCommentService = async (postId, userId, text) => {
  // Empty ya whitespace comment allow nahi karenge
  if (!text || !text.trim()) {
    throw new ApiError("Comment text cannot be empty", 400);
  }

  // Pehle check karein ki post database me exist karti hai ya nahi
  const post = await postModel.findById(postId);
  if (!post) {
    throw new ApiError("Post not found", 404);
  }

  // Naya comment create kar rahe hain
  const newComment = await commentModel.create({
    post: postId,
    user: userId,
    text: text.trim(),
  });

  // User details (username, profileImage, name) populate karke return karenge
  // taaki frontend bina extra API call ke author info display kar sake
  await newComment.populate("user", "username profileImage name");

  return newComment;
};

/**
 * @desc Specific post ke saare comments fetch karta hai
 * @param {string} postId - Post ki ObjectId
 */
export const getPostCommentsService = async (postId) => {
  if (!postId) {
    throw new ApiError("Post ID is required", 400);
  }

  // Latest comments pehle dikhane ke liye createdAt descending order me sort kar rahe hain
  const comments = await commentModel
    .find({ post: postId })
    .sort({ createdAt: -1 })
    .populate("user", "username profileImage name")
    .lean();

  return comments;
};

/**
 * @desc Comment delete karne ke liye (sirf comment author delete kar sakta hai)
 * @param {string} commentId - Comment ki ObjectId
 * @param {string} userId - Request karne wale user ki ObjectId
 */
export const deleteCommentService = async (commentId, userId) => {
  const comment = await commentModel.findById(commentId);
  if (!comment) {
    throw new ApiError("Comment not found", 404);
  }

  // Authorization check: Dusre user ka comment delete karne ki permission nahi hai
  if (comment.user.toString() !== userId.toString()) {
    throw new ApiError("You are not authorized to delete this comment", 403);
  }

  await commentModel.findByIdAndDelete(commentId);
  return { deletedCommentId: commentId };
};
