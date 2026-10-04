import { userModel } from "../models/user.model.js";
import ApiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { Verify_Token } from "../utils/token.js";

const authMiddleware = asyncHandler(async (req, res, next) => {
  const token = req.cookies.jwt_token;

  if (!token) throw new ApiError("Unauthorized", 401);

  const decode = Verify_Token(token);

  if (!decode) throw new ApiError("Unauthorized", 401);

  const User = await userModel.findById(decode.id);

  if (!User) throw new ApiError("Unauthorized", 401);

  req.user = User;

  next();
});

export default authMiddleware;
