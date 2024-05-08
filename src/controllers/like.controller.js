import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/apierror.js"
import {apiresponse} from "../utils/apiresponse.js"
import {asynchandler} from "../utils/asynchandler.js"

const toggleVideoLike = asynchandler(async (req, res) => {
    const {videoId} = req.params
    const userid = req._id
    
    if(!isValidObjectId(videoId)) {
        throw new ApiError(400, "uable to find video")
    }

    try {
        const existinglike = await Like.findOne({
            video: videoId,
            likedBy: userid,
        })
    
        if(existinglike) {
            await Like.findByIdAndDelete(existinglike._id)
            return res
            .status(200)
            .json(new apiresponse(201, "video disliked succesfully"))
        } else {
            await Like.create({
                video: videoId,
                likedBy: userid,
            })
    
            return res
            .status(201)
            .json(new apiresponse(201, "video liked sucessfully"))
        }
    } catch (error) {
        throw new ApiError(500, "problem is video liking or disliking")
    }
})

const toggleCommentLike = asynchandler(async (req, res) => {
    const {commentId} = req.params
    const userid = req._id
    
    if(!isValidObjectId(commentId)) {
        throw new ApiError(400, "unable to find comment")
    }

    
    try {
        const existinglike = await Like.findOne({
            comment: commentId,
            likedBy: userid,
        })
    
        if(existinglike) {
            await Like.findByIdAndDelete(existinglike._id)
            return res
            .status(200)
            .json(new apiresponse(201, "comment disliked succesfully"))
        } else {
            await Like.create({
                comment: commentId,
                likedBy: userid,
            })
    
            return res
            .status(201)
            .json(new apiresponse(201, "comment liked sucessfully"))
        }
    } catch (error) {
        throw new ApiError(500, "problem comment liking or disliking")
    }

})

const toggleTweetLike = asynchandler(async (req, res) => {
    const {tweetId} = req.params
    const userid = req._id
    
    if(!isValidObjectId(tweetId)) {
        throw new ApiError(400, "unable to find comment")
    }

    try {
        const existinglike = await Like.findOne({
            tweet: tweetId,
            likedBy: userid,
        })
    
        if(existinglike) {
            await Like.findByIdAndDelete(existinglike._id)
            return res
            .status(200)
            .json(new apiresponse(201, "tweet disliked succesfully"))
        } else {
            await Like.create({
                tweet: tweetId,
                likedBy: userid,
            })
    
            return res
            .status(201)
            .json(new apiresponse(201, "tweet liked sucessfully"))
        }
    } catch (error) {
        throw new ApiError(500, "problem tweet liking or disliking")
    }
}
)

const getLikedVideos = asynchandler(async (req, res) => {
    const userid = req._id

    try {
        const likedvideos = await Like.find({
            likedBy: userid,
            video: {
                $exists: true
            }
        }).populate('video')

        const videos = likedvideos.map(like => ({
            videoid: like.video._id,
            title: like.video.title
        }))

        return res
        .status(201)
        .json(new apiresponse(201, videos, "fetched all the liked videos"))
    } catch (error) {
        throw new ApiError(500, "error while fetching the liked videos")
    }
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}