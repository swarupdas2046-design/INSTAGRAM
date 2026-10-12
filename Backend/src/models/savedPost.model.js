import mongoose from "mongoose";

const savedPostSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userPosts",
      required: [true, "Post id is required for saving a post"],
    },
    user: {
      type: String,
      required: [true, "Username is required for saving a post"],
    },
  },
  {
    timestamps: true,
  }
);

// Ek user same post ko sirf ek baar save kar sakta hai.
savedPostSchema.index({ post: 1, user: 1 }, { unique: true });

const savedPostModel = mongoose.model("SavedPost", savedPostSchema);

export default savedPostModel;
