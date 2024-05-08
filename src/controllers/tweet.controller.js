import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/apierror.js"
import {apiresponse} from "../utils/apiresponse.js"
import {asynchandler} from "../utils/asynchandler.js"

const createTweet = asynchandler(async (req, res) => {
    const { content } = req.body;
    const userid = req._id

    if(!content) {
        throw new ApiError(400, "content is required")
    }

    const response = await Tweet.create({
        content: content,
        owner: userid,
    })

    return res
    .status(200)
    .json(new apiresponse(201, response, "tweet created successfully"))
})

const getUserTweets = asynchandler(async (req, res) => {
    const userid = req._id

    const tweets = await Tweet.find({
        owner: userid
    }).populate('content')

    const alltweets = tweets.map(tweet => ({
        content: tweet.content
    }))

    return res
    .status(200)
    .json(new apiresponse(200, alltweets, 'all tweets fetched'))
})

const updateTweet = asynchandler(async (req, res) => {
    const { tweetId } = req.params
    const content = req.body

    if(!isValidObjectId(tweetId)) {
        throw new ApiError(400, "cant find the tweet")
    }

    if(!content) {
        throw new ApiError(400, "content is required")
    }

    const tweetupdateresponse = await Tweet.findByIdAndUpdate(
        tweetId,
        {
            $set: {
                content: content
            }
        },
        {new: true}
    )

    return res
    .status(201)
    .json(new apiresponse(201, tweetupdateresponse, "tweet updated successfully"))
})

const deleteTweet = asynchandler(async (req, res) => {
    const { tweetId } = req.params

    if(!isValidObjectId(tweetId)) {
        throw new ApiError(400, "cant find the tweet")
    }

    await Tweet.findByIdAndDelete(tweetId)

    return res
    .status(201)
    .json(new apiresponse(201, "tweet deleted successfully"))
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}