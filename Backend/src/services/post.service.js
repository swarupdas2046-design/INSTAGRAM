import sendFile from "../config/imagekit.js";
import { commentModel } from "../models/comment.model.js";
import followModel from "../models/follow.model.js";
import likeModel from "../models/like.model.js";
import { postModel } from "../models/post.model.js";
import savedPostModel from "../models/savedPost.model.js";
import { userModel } from "../models/user.model.js";
import ApiError from "../utils/apiError.js";

// ==============================================================================
// 📸 POST SERVICE - INSTAGRAM CLONE (ENHANCED EDITION)
// ==============================================================================

/**
 * @desc Helper: Posts array ko likes, comments aur current user like state se enrich karta hai.
 * Hinglish: N+1 query problem avoid karne ke liye batch aggregation & mapping use kar rahe hain.
 */
export const enrichPostsWithStats = async (posts, currentUsername) => {
  if (!posts || posts.length === 0) return [];

  const postIds = posts.map((p) => p._id);

  // Saare relevant likes ek saath query kar rahe hain
  const allLikes = await likeModel.find({ post: { $in: postIds } }).lean();

  // Saare relevant comments ek saath query kar rahe hain
  const allComments = await commentModel.find({ post: { $in: postIds } }).lean();

  // Current user ne kaunse posts save kiye hain, ek hi query me nikal rahe hain.
  const savedPosts = currentUsername
    ? await savedPostModel.find({ post: { $in: postIds }, user: currentUsername }).lean()
    : [];

  return posts.map((post) => {
    const postIdStr = post._id.toString();

    // Is post ke saare likes filter kar rahe hain
    const postLikes = allLikes.filter(
      (l) => l.post && l.post.toString() === postIdStr
    );

    // Is post ke saare comments filter kar rahe hain
    const postComments = allComments.filter(
      (c) => c.post && c.post.toString() === postIdStr
    );

    // Check kar rahe hain ki logged-in user ne is post ko like kiya hai ya nahi
    const isLikedByCurrentUser = postLikes.some(
      (l) => l.user === currentUsername
    );

    const isSavedByCurrentUser = savedPosts.some(
      (s) => s.post && s.post.toString() === postIdStr
    );

    return {
      ...post,
      likesCount: postLikes.length,
      liked: isLikedByCurrentUser,
      commentsCount: postComments.length,
      saved: isSavedByCurrentUser,
    };
  });
};

/**
 * @desc Naya post create karta hai (Multiple images support)
 */
export const PostService = async (User, files, caption) => {
  if (!files || files.length === 0) throw new ApiError("Image is required", 400);

  const data = await Promise.all(
    files.map((elem) => {
      const response = sendFile(elem.buffer, elem.originalname, "posts");
      return response;
    })
  );

  if (!data) throw new ApiError("Image Upload Failed", 500);

  const urlData = data.map((elem) => {
    return {
      url: elem.url,
      fileId: elem.fileId,
    };
  });

  const post = await postModel.create({
    user: User._id,
    caption,
    imageUrl: urlData,
  });

  return post;
};

/**
 * @desc Logged-in user ke apne posts fetch karta hai
 */
export const allPostService = async (user) => {
  const allPosts = await postModel
    .find({ user: user._id })
    .sort({ createdAt: -1 })
    .populate("user", "username profileImage name bio")
    .lean();

  return await enrichPostsWithStats(allPosts, user.username);
};

/**
 * @desc Kisi specific post ki details fetch karta hai
 */
export const postDetailsService = async (postId, user) => {
  if (!postId) throw new ApiError("Post ID is required", 400);

  const post = await postModel
    .findById(postId)
    .populate("user", "username profileImage name bio")
    .lean();

  if (!post) throw new ApiError("Post not found", 404);

  const [enriched] = await enrichPostsWithStats([post], user.username);
  return enriched;
};

/**
 * @desc Post ko like karta hai
 * Hinglish: Duplicate like rokne ke liye pehle existing check karte hain
 */
export const likePostService = async (postId, username) => {
  const post = await postModel.findById(postId);
  if (!post) throw new ApiError("Post not found", 404);

  const existingLike = await likeModel.findOne({
    post: postId,
    user: username,
  });

  if (existingLike) {
    // Agar pehle se liked hai toh error throw karne ke bajaye current count return karein
    const count = await likeModel.countDocuments({ post: postId });
    return { liked: true, likesCount: count, message: "Already liked" };
  }

  await likeModel.create({
    post: postId,
    user: username,
  });

  const count = await likeModel.countDocuments({ post: postId });
  return { liked: true, likesCount: count, message: "Post liked successfully" };
};

/**
 * @desc Post ko unlike karta hai
 * Hinglish: Like record database se delete karke updated likesCount return karta hai
 */
export const unlikePostService = async (postId, username) => {
  const post = await postModel.findById(postId);
  if (!post) throw new ApiError("Post not found", 404);

  await likeModel.findOneAndDelete({
    post: postId,
    user: username,
  });

  const count = await likeModel.countDocuments({ post: postId });
  return { liked: false, likesCount: count, message: "Post unliked successfully" };
};

/**
 * @desc Post ko like karne wale users ki list fetch karta hai
 * Hinglish: likeModel me user username ke format me save hai, isliye userModel se
 * un sabhi usernames ki profile information (avatar, name, bio) retrieve karte hain
 */
export const getPostLikesService = async (postId) => {
  const post = await postModel.findById(postId);
  if (!post) throw new ApiError("Post not found", 404);

  const likes = await likeModel.find({ post: postId }).sort({ createdAt: -1 }).lean();
  const usernames = likes.map((l) => l.user);

  const users = await userModel
    .find({ username: { $in: usernames } })
    .select("username profileImage name bio")
    .lean();

  return users;
};

/**
 * @desc HOME FEED: Followed users ke posts fetch karta hai
 * Hinglish: Logged-in user jin accounts ko follow karta hai (status: accepted),
 * unke posts latest first order me return karta hai.
 */
export const getFollowingFeedService = async (currentUser) => {
  // Current user ke saare accepted follows nikalein
  const follows = await followModel
    .find({ follower: currentUser.username, status: "accepted" })
    .lean();

  const followingUsernames = follows.map((f) => f.followee);

  // Agar user ne kisi ko follow nahi kiya, toh empty array return karenge
  // taaki frontend empty state aur suggested users display kar sake
  if (followingUsernames.length === 0) {
    return [];
  }

  // Followed usernames ke User ObjectIds find karte hain
  const followedUsers = await userModel
    .find({ username: { $in: followingUsernames } })
    .select("_id")
    .lean();

  const followedUserIds = followedUsers.map((u) => u._id);

  const posts = await postModel
    .find({ user: { $in: followedUserIds } })
    .sort({ createdAt: -1 })
    .populate("user", "username profileImage name bio")
    .lean();

  return await enrichPostsWithStats(posts, currentUser.username);
};

/**
 * @desc GLOBAL EXPLORE FEED / REELS DISCOVERY: Saare users ke image posts fetch karta hai
 * Hinglish: Ye feed discovery ke liye hai, jisme followed aur non-followed sabhi ke posts dikhte hain.
 */
export const getExploreFeedService = async (currentUser) => {
  const posts = await postModel
    .find({})
    .sort({ createdAt: -1 })
    .populate("user", "username profileImage name bio")
    .lean();

  return await enrichPostsWithStats(posts, currentUser ? currentUser.username : null);
};

/**
 * @desc Kisi specific user ke saare posts fetch karta hai (User profile page ke liye)
 */
export const getUserPostsService = async (targetUsername, currentUsername) => {
  const targetUser = await userModel.findOne({ username: targetUsername });
  if (!targetUser) throw new ApiError("User not found", 404);

  const posts = await postModel
    .find({ user: targetUser._id })
    .sort({ createdAt: -1 })
    .populate("user", "username profileImage name bio")
    .lean();

  return await enrichPostsWithStats(posts, currentUsername);
};

/**
 * @desc Post save karta hai
 * Hinglish: Bookmark click par yahan DB me permanent saved record create hota hai.
 */
export const savePostService = async (postId, username) => {
  const post = await postModel.findById(postId);
  if (!post) throw new ApiError("Post not found", 404);

  const existingSave = await savedPostModel.findOne({ post: postId, user: username });
  if (existingSave) {
    return { saved: true, message: "Already saved" };
  }

  await savedPostModel.create({ post: postId, user: username });
  return { saved: true, message: "Post saved successfully" };
};

/**
 * @desc Saved post remove karta hai
 */
export const unsavePostService = async (postId, username) => {
  const post = await postModel.findById(postId);
  if (!post) throw new ApiError("Post not found", 404);

  await savedPostModel.findOneAndDelete({ post: postId, user: username });
  return { saved: false, message: "Post removed from saved" };
};

/**
 * @desc Logged-in user ke saved posts fetch karta hai
 * Hinglish: Saved tab me wahi posts dikhengi jo user ne bookmark ki hain.
 */
export const getSavedPostsService = async (currentUser) => {
  const savedRecords = await savedPostModel
    .find({ user: currentUser.username })
    .sort({ createdAt: -1 })
    .populate({
      path: "post",
      populate: { path: "user", select: "username profileImage name bio" },
    })
    .lean();

  const posts = savedRecords
    .map((record) => record.post)
    .filter(Boolean);

  return await enrichPostsWithStats(posts, currentUser.username);
};
