import followModel from "../models/follow.model.js";
import { userModel } from "../models/user.model.js";
import ApiError from "../utils/apiError.js";

export const followUserService = async (followerName, followeeName) => {
    console.log("Follower Name :---->",followerName)
    console.log("Followeee Name :----->",followeeName);
    

// ------------ check if the user followee is the same as the follower ------------
    if(followeeName === followerName) throw new ApiError("You can't follow yourself",400)

// ------------ check if the user followee user is existed ------------
    const isExisted = await userModel.findOne({username:followeeName})

    if(!isExisted) throw new ApiError("User not found",404)

// ------------ check if the user is already following the user ------------
    const isAllreadyFollow = await followModel.findOne({
        followee:followeeName,
        follower:followerName,
    })

    if(isAllreadyFollow){
        if(isAllreadyFollow.status === "pending") throw new ApiError("You have already sent a follow request",200)

        if(isAllreadyFollow.status === "accepted") throw new ApiError("You are already following this user",200)
    }

// ------------ follow the user ------------
    const followData = await followModel.create({
        followee:followeeName,
        follower:followerName
    })

    return {
        followData,
        followeeName
    }
};

export const unfollowUserService = async (user, unfollowUser) => {
    const isExisted = await userModel.findOne({username:unfollowUser})

    if(!isExisted) throw new ApiError("User not found",404)

    const isFollowed = await followModel.findOne({
        followee:unfollowUser,
        follower:user,
        status:"accepted"
    })

    if(!isFollowed) throw new ApiError("You are not following this user",200)

    await followModel.findByIdAndDelete(isFollowed._id)

    return unfollowUser
}

