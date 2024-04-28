import { Router } from "express";
import { registeruser } from "../controllers/user.controllers.js";
import {upload} from '../middlewares/multer.middleware.js'
const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxcount: 1,
        },
        {
            name: "cover image",
            maxCount: 1,
        }
    ]),
    registeruser
);

export default router;
