import { Router } from "express";
import { loginuser, logoutuser, registeruser } from "../controllers/user.controllers.js";
import {upload} from '../middlewares/multer.middleware.js'
import {verifyJWT} from '../middlewares/auth.middleware.js'
const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxcount: 1,
        },
        {
            name: "coverimage",
            maxCount: 1,
        }
    ]),
    registeruser
);
router.route("/login").post(loginuser)

// secred routes
router.route("/logout").post(verifyJWT, logoutuser)
export default router;
