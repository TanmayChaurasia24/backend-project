import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    getVideoComments, 
    addComment, 
    updateComment,
    deleteComment
} from "../controllers/comment.controller.js"

const router = Router()

router.get('/videos/:videoId/comments',verifyJWT, getVideoComments);

router.post('/videos/:videoId/comments',verifyJWT, addComment);

router.put('/comments/:commentID',verifyJWT, updateComment);

router.delete('/comments/:commentID',verifyJWT, deleteComment);



export default router