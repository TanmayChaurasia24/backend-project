import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/apierror.js"
import {apiresponse} from "../utils/apiresponse.js"
import {asynchandler} from "../utils/asynchandler.js"


const createPlaylist = asynchandler(async (req, res) => {
    const {name, description} = req.body

    if(!(name || description)) {
        throw new ApiError(400, "all fields are required for creating playlist")
    }

    const createPlaylist = await Playlist.create({
        name: name,
        description: description,
        owner: req.user._id
    })

    return res
    .status(201)
    .json(new apiresponse(201, createPlaylist, "playlist created successfully"))
})

const getUserPlaylists = asynchandler(async (req, res) => {
    const {userId} = req.params
    
    if(!userId) {
        throw new ApiError(500, "invalid userId")
    }

    const userplaylistresponse = await Playlist.aggregate([
        {
            $match: { owner: userId }
        }
    ]);
    

    const allplaylistname = userplaylistresponse.map(playlist => ({
        title: playlist.name
    }))

    return res
    .status(201)
    .json(new apiresponse(201, allplaylistname, "all playlist are fetched successfully"))
})

const getPlaylistById = asynchandler(async (req, res) => {
    const { playlistId } = req.params

    if(!isValidObjectId(playlistId)) {
        throw new ApiError(404,"Invalid playlist Id")
    }

    const playlist = await Playlist.findById(playlistId)

    if(playlist == null) {
        throw new ApiError(400, "no playlist found")
    }

    return res
    .status(200)
    .json(new apiresponse(201, playlist, "playlist fetched succesfully"))
    
})

const addVideoToPlaylist = asynchandler(async (req, res) => {
    const {playlistId, videoId} = req.params

    if(!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
        throw new ApiError(400, "invalid video or playlist ID")
    }

    const playlist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $push: {
                videos: videoId
            }
        },
        {new : true} 
    )

    return res
    .status(200)
    .json(new apiresponse(201 , "video added to playlist succesfully"))
})

const removeVideoFromPlaylist = asynchandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    
    if(!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
        throw new ApiError(400 , "invalid video or playlist ID")
    }

    const playlist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $pull: {
                videos: videoId
            }
        },
        {new: true}
    )

    if(!playlist) {
        throw new ApiError(404,"playlist not found")
    }

    return res
    .status(201)
    .json(new apiresponse(201, "video deleted from the playlist"))
})

const deletePlaylist = asynchandler(async (req, res) => {
    const {playlistId} = req.params
    
    if(!isValidObjectId(playlistId)) {
        throw new ApiError(404, "playlist not found")
    }

    await Playlist.findByIdAndDelete(playlistId)

    return res
    .status(200)
    .json(new apiresponse(201, "playlist deleted succesfully"))
})

const updatePlaylist = asynchandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    
    if(!isValidObjectId(playlistId)) {
        throw new ApiError(404, "playlist not found")
    }

    if(!name && !description) {
        throw new ApiError(404, "all feilds are required for updating the playlist")
    }

    const playlist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $set: {
                name: name,
                description: description
            }
        },
        {
            new: true 
        }
    )

    if(!playlist) {
        throw new ApiError(404, "playlist not found")
    }

    return res
    .status(201)
    .json(new apiresponse(201, playlist, "playlist updated succesfully"))
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}