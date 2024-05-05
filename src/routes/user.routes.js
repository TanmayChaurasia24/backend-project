import { Router } from "express";
import { loginuser, logoutuser, registeruser,refreshaccesstoken, changecurrentpassword, updateaccountdetail, getcurrentuser, updateuseravatar, getuserchannelprofile,getWatchHistory } from "../controllers/user.controllers.js";
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
router.route("/refresh-token").post(refreshaccesstoken)
router.route("/change-password").post(verifyJWT, changecurrentpassword)
router.route("/current-user").get(verifyJWT, getcurrentuser)
router.route("/update-account").patch(verifyJWT, updateaccountdetail)

router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateuseravatar)

router.route("/c/:username").get(verifyJWT, getuserchannelprofile)
router.route("/history").get(verifyJWT, getWatchHistory)

export default router;
