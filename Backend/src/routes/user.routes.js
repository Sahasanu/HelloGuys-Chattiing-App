import express from "express";
import { protectroute } from "../middleware/middleware.js";
import {getMyFriends, getRecommendation,sendFriendRequest,acceptFriendRequest,getFriendRequests, getOutgoingFriendRequests, updateProfile} from "../controllers/user.controller.js"
const router = express.Router ();

router.use(protectroute)

router.get("/" ,getRecommendation)
router.get("/friends",getMyFriends)
router.get("/friends-request/:id",sendFriendRequest)
router.post("/friends-request/:id/accept",acceptFriendRequest)
router.get("/friends-request",getFriendRequests)
router.get("/outgoing-friends-request",getOutgoingFriendRequests)
router.put('/update-profile', updateProfile)

export default router