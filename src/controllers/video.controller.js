import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/apierror.js"
import {apiresponse} from "../utils/apiresponse.js"
import {asynchandler} from "../utils/asynchandler.js"
import {uploadoncloudinary} from "../utils/cloudinary.js"


// Get all videos with pagination, sorting, and filtering
const getAllVideos = asynchandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
    const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: { [sortBy]: sortType === 'desc' ? -1 : 1 },
        populate: 'owner', // Assuming you want to populate the owner field
    };

    const queryOptions = {};

    if (query) {
        // Implement query filtering based on your requirements
        queryOptions.$or = [
            { title: { $regex: query, $options: 'i' } },
            { description: { $regex: query, $options: 'i' } },
        ];
    }

    if (userId) {
        queryOptions.owner = userId;
    }

    const videos = await Video.paginate(queryOptions, options);
    res.json(videos);
});

const publishAVideo = asynchandler(async (req, res) => {
    const {videofile,thumbnail,title,description,duration} = req.body

    const cloudinaryresponsevideo = await uploadoncloudinary(videofile)

    if(!cloudinaryresponsevideo.url) {
        throw new ApiError(500, "failed to upload file on cloudinary")
    }
    const cloudinaryresponsethumbnail = await uploadoncloudinary(thumbnail)

    if(!cloudinaryresponsethumbnail.url) {
        throw new ApiError(500, "failed to upload file on cloudinary")
    }

    const video = await Video.create({
        owner : req.user._id,
        title,
        description,
        duration,
        thumbnail : cloudinaryresponsethumbnail.url,
        videofile : cloudinaryresponsevideo.url
    })

    return res.status(200).json(new apiresponse(201, video, "video uploaded sucessfully"))
})

const getVideoById = asynchandler(async (req, res) => {
    const { videoId } = req.params
    const video = await Video.findById(videoId)

    if(!video) {
        throw new ApiError(404, "video not found")
    }

    return res.status(200).json(new apiresponse(201,video,"fetched video id sucessfully"))
})

const updateVideo = asynchandler(async (req, res) => {
    const { videoId } = req.params

    if(!videoId) {
        throw new ApiError(404, "cant get video id")
    }

    const {title,thumbnail,description} = req.body

    if(!title && !description && !thumbnail) {
        throw new ApiError(400, "enter fields to update the video")
    }

    const cloudinaryresponsethumbnail = await uploadoncloudinary(thumbnail)

    if(!cloudinaryresponsethumbnail.url) {
        throw new ApiError(500, "cant upload video to cloudinary")
    }

    const video = await Video.findByIdAndUpdate(
        videoId ,
        {
            $set: {
                title: title,
                thumbnail: cloudinaryresponsethumbnail.url,
                description: description
            }
        },
        { new: true } 
    )
    
    return res
    .status(200)
    .json(
        new apiresponse(201, video, "video updated successfully")
    )
})

const deleteVideo = asynchandler(async (req, res) => {
    const { videoId } = req.params
    
    if(!videoId) {
        throw new ApiError(404, "cant get video id")
    }

    const video = await Video.findByIdAndDelete(videoId)

    if(!video) {
        throw new ApiError(404, "video not find")
    }

    return res
    .status(200)
    .json(new apiresponse(201, video, "video deleted successfully"))
})

const togglePublishStatus = asynchandler(async (req, res) => {
    const { videoId } = req.params;
    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, 'Video not found');
    }
    video.ispublished = !video.ispublished;
    await video.save();
    res.json({ message: 'Publish status toggled successfully', ispublished: video.ispublished });
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}