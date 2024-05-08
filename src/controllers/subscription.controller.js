import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/apierror.js"
import {apiresponse} from "../utils/apiresponse.js"
import {asynchandler} from "../utils/asynchandler.js"


const toggleSubscription = asynchandler(async (req, res) => {
    const {channelId} = req.params
    const userid = req._id

    if(!isValidObjectId(channelId)) {
        throw new ApiError(500 , "no channel found")
    }

    try {
        const existingsubscription = await Subscription.findOne({
            channel: channelId,
            subscriber: userid,
        })

        if(existingsubscription) {
            await Subscription.findByIdAndDelete(existingsubscription._id)
            return res
            .status(200)
            .json(new apiresponse(201, "sucessfully unsubscribed the channel"))
        } else {
            await Subscription.create({
                channel: channelId,
                subscriber: userid
            })
            return res
            .status(200)
            .json(new apiresponse(201,"successfully subscribed to the channel"))
        }

    } catch (error) {
        throw new ApiError(500, "error while toggle subscription")
    }
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asynchandler(async (req, res) => {
    const {channelId} = req.params

    if(!isValidObjectId(channelId)) {
        throw new ApiError(404, "no channel found")
    }

    try {
        const subscriptions = await Subscription.find({
            channel: channelId
        }).populate('subscriber')

        const subscribers = subscriptions.map(subscription => ({
            userId: subscription.subscriber._id,
            username: subscription.subscriber.username,
        }))
    
        return res
        .status(200)
        .json(new apiresponse(201, subscribers, "fetched all subscribers"))
    } catch (error) {
        throw new ApiError(500, "error while fetching all subscribers")
    }

})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asynchandler(async (req, res) => {
    const { subscriberId } = req.params

    if(!isValidObjectId(subscriberId)) {
        throw new ApiError(400, "invalid subscriber id")
    }

    const subscriptions = await Subscription.find({
        subscriber: subscriberId
    }).populate('channel')

    const subscribedchannels = subscriptions.map(sub => ({
        channelId: sub.channel._id,
        channelname: sub.channel.username,
    }))

    return res
    .status(200)
    .json(new apiresponse(201, subscribedchannels, "fetched all subscribed channels"))
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}