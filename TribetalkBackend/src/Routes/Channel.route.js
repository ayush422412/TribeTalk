import { Router } from "express";
import {
    createChannel,
    deleteChannel,
    editChannel,
    getChannelInfo
} from "../Controllers/Channel.controller.js";
import { verifyJWT } from "../Middlewares/Auth.middleware.js";
import { verifyChannelAccess } from "../Middlewares/ChannelAccess.middleware.js";

const router = Router();

// Apply auth to all channel routes
router.use(verifyJWT);

// Create channel (no channel ID yet; server ID & permissions verified in service)
router.route("/create-channel").post(createChannel);

// Protected channel operations requiring channel access verification
router.get("/channel-info/:id", verifyChannelAccess, getChannelInfo);
router.patch("/edit-channel/:id", verifyChannelAccess, editChannel);
router.delete("/delete-channel/:id", verifyChannelAccess, deleteChannel);

export default router;