import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
} from "../controllers/video.controller.js";

const router = Router()

router.route("/videos/getallvideos").get(verifyJWT, getAllVideos)
router.route("/videos/publishvideo").get(verifyJWT, publishAVideo)
router.route("/videos/:videoId").get(verifyJWT, getVideoById)
router.route("/videos/updatevideo/:videoId").get(verifyJWT, updateVideo)
router.route("/videos/deletevideo/:videoId").get(verifyJWT, deleteVideo)
router.route("/videos/ispublished/:videoId").get(verifyJWT, togglePublishStatus)



export default router