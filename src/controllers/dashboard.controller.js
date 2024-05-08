import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/apierror.js"
import {apiresponse} from "../utils/apiresponse.js"
import {asynchandler} from "../utils/asynchandler.js"

const getChannelStats = asynchandler(async (req, res) => {
    try {
        const channelId = req.user._id; 

        const totalVideoViews = await Video.aggregate([
            { $match: { channel: mongoose.Types.ObjectId(channelId) } },
            { $group: { _id: null, totalViews: { $sum: "$views" } } }
        ]);

        // Get total subscribers
        const totalSubscribers = await Subscription.countDocuments({ channel: channelId });

        // Get total videos
        const totalVideos = await Video.countDocuments({ channel: channelId });

        // Get total likes on videos
        const totalLikes = await Like.countDocuments({ video: { $in: await Video.find({ channel: channelId }).distinct('_id') } });

        // Prepare response
        const channelStats = {
            totalVideoViews: totalVideoViews.length > 0 ? totalVideoViews[0].totalViews : 0,
            totalSubscribers: totalSubscribers,
            totalVideos: totalVideos,
            totalLikes: totalLikes
        };

        // Send response
        return res.status(200).json(new apiresponse(200, channelStats, "Channel stats fetched successfully"));
    } catch (error) {
        // Handle errors
        throw new ApiError(500, "Internal server error");
    }
});

const getChannelVideos = asynchandler(async (req, res) => {
    try {
        
        const channelId = req.user._id; 

        const channelVideos = await Video.find({ channel: channelId })

        // Send response
        return res.status(200).json(new apiresponse(200, channelVideos, "Channel videos fetched successfully"));
    } catch (error) {
        // Handle errors
        throw new ApiError(500, "Internal server error");
    }
});

export {
    getChannelStats,
    getChannelVideos
};

