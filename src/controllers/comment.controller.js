import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/apierror.js"
import {apiresponse} from "../utils/apiresponse.js"
import {asynchandler} from "../utils/asynchandler.js"
import { User } from "../models/user.model.js"

const getVideoComments = asynchandler(async (req, res) => {
    const { videoId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const comments = await Comment.find({ videoId })
        .skip((page - 1) * limit)
        .limit(limit);

    return res.status(200).json(new apiresponse(200, comments, "Video comments fetched successfully"));
});


const addComment = asynchandler(async (req, res) => {
    // when we will click any video then we will get the video id from url
    const {videoId} = req.params;
    const {content} = req.body;
    const user = await User.findById(req.user?._id)

    if(!videoId) {
        throw new ApiError(500, "video id is required")
    }

    if(!content) {
        throw new ApiError(401, "please add the comment")
    }

    const comment = await Comment.create({
        content,
        video: videoId,
        owner: user
    })

    return res
    .status(200)
    .json(new apiresponse(201, comment, "comment added sucessfully"))
})

const updateComment = asynchandler(async (req, res) => {
    const {commentID} = req.params;
    const {content} = req.body;

    const comment = await Comment.findByIdAndUpdate(
        commentID,
        {
            $set: {
                content
            }
        },
        {new: true}
    )

    if(!comment) {
        throw new ApiError(401, "unable to find the comment")
    }

    return res
    .status(200)
    .json(new apiresponse(201, "comment updated sucessfully"))
})

const deleteComment = asynchandler(async (req, res) => {
    const { commentID } = req.params;

    const response = await Comment.findByIdAndDelete(commentID)

    if(!response) {
        throw new ApiError(404, "comment not found");
    }

    return res
    .status(200)
    .json(new apiresponse(201, "comment deleted sucessfully"))
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
}