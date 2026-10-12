import {
  addCommentService,
  deleteCommentService,
  getPostCommentsService,
} from "../services/comment.service.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

// ==============================================================================
// 💬 COMMENT CONTROLLER - INSTAGRAM CLONE
// ==============================================================================

/**
 * @desc Add comment to a post
 * @route POST /api/post/comment/:id
 */
export const addCommentController = asyncHandler(async (req, res) => {
  const { text } = req.body;
  const postId = req.params.id;
  const userId = req.user._id;

  // Logged-in user ka comment create kar rahe hain
  const comment = await addCommentService(postId, userId, text);

  return res
    .status(201)
    .json(new ApiResponse("Comment added successfully", comment));
});

/**
 * @desc Get all comments for a post
 * @route GET /api/post/comments/:id
 */
export const getPostCommentsController = asyncHandler(async (req, res) => {
  const postId = req.params.id;

  const comments = await getPostCommentsService(postId);

  return res
    .status(200)
    .json(new ApiResponse("Comments fetched successfully", comments));
});

/**
 * @desc Delete a comment
 * @route DELETE /api/post/comment/:commentId
 */
export const deleteCommentController = asyncHandler(async (req, res) => {
  const commentId = req.params.commentId;
  const userId = req.user._id;

  const result = await deleteCommentService(commentId, userId);

  return res
    .status(200)
    .json(new ApiResponse("Comment deleted successfully", result));
});
