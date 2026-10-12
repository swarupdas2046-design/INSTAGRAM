import mongoose from "mongoose";

// ==============================================================================
// 💬 COMMENT MODEL - INSTAGRAM CLONE
// ==============================================================================
// Har comment ek specific post aur user se link hota hai.
// Hinglish: 'user' field UserInfo collection ko reference karta hai taaki
// user ka avatar aur username populate karke frontend pe dikha sakein.

const commentSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userPosts",
      required: [true, "Post id is required for comment"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserInfo",
      required: [true, "User id is required for comment"],
    },
    text: {
      type: String,
      required: [true, "Comment text is required"],
      trim: true,
      maxlength: [1000, "Comment cannot exceed 1000 characters"],
    },
  },
  {
    timestamps: true,
  }
);

// Fast comment lookup ke liye post id par index
commentSchema.index({ post: 1, createdAt: -1 });

export const commentModel = mongoose.model("Comment", commentSchema);
