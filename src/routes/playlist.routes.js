import { Router } from "express";
import {verifyJWT} from "../middlewares/auth.middleware.js"
import {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
} from "../controllers/playlist.controller.js"

const router = Router()

router.route("/createplaylist").post(verifyJWT,createPlaylist)

router.route('/getuserplaylists').get(verifyJWT,getUserPlaylists)

router.route('/playlistbyid/:playlistId').get(verifyJWT,getPlaylistById)

router.route('/addvideo/:playlistId/:videoId').post(verifyJWT, addVideoToPlaylist)

router.route('/remove/playlist/:playlistId/video/videoId').post(verifyJWT, removeVideoFromPlaylist)

router.route('/:playlistId').delete(verifyJWT, deletePlaylist)

router.route('/playlist/updateplaylist/:playlistId').patch(verifyJWT, updatePlaylist)



export default router