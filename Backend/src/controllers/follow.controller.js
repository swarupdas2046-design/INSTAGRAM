import followModel from "../models/follow.model.js";
import {
  followUserService,
  unfollowUserService,
} from "../services/follow.service.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const followUserController = asyncHandler(async (req, res) => {
  const { followData, followeeName } = await followUserService(
    req.user.username,
    req.params.username,
  );

  return res
    .status(201)
    .json(new ApiResponse(`follow request sent to ${followeeName}`, followData));
});

export const unfollowUserController = asyncHandler(async (req, res) => {
  
  const unfollowUser  = await unfollowUserService(
    req.user.username,
    req.params.username,
  );

  return res
    .status(200)
    .json(new ApiResponse(`You have unfollowed ${unfollowUser}`));
});

// -------------- Follow Request Controller --------------
export const followRequestController = asyncHandler(async(req,res)=>{
    const followeeName = req.user.username
    
    const allRequest = await followModel.find({
      followee:followeeName,
      status:"pending"
    })

    if (!allRequest) throw new ApiError("No request found",404)

    return res.status(200).json(new ApiResponse("Request Fetched Successfully",allRequest))
})

// -------------- Accept Request Controller --------------
export const acceptController = asyncHandler(async(req,res)=>{
    const followeeName = req.user.username
    const followerName = req.params.username

  const requestData = await followModel.findOne({
    follower:followerName,
    status:"pending",
    followee:followeeName
  })

if(!requestData) throw new ApiError("Request not found",404)

  const acceptedRequested = await followModel.findByIdAndUpdate(requestData._id,{status:"accepted"},{returnDocument:true})

  return res.status(200).json(new ApiResponse("Request Accepted Successfully",acceptedRequested))

})

// -------------- Reject Request Controller --------------
export const rejectController = asyncHandler(async(req,res)=>{
    const followeeName = req.user.username
    const followerName = req.params.username

    const requestData = await followModel.findOne({
        follower:followerName,
        status:"pending",
        followee:followeeName
      })
      
      if(!requestData) throw new ApiError("Request not found",404)
      
      await followModel.findByIdAndDelete(requestData._id)
      
      return res.status(200).json(new ApiResponse("Request Rejected Successfully"))
})