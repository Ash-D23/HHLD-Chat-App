import express from "express"
import getMsgsForConversation, { getConversationForUser, getGroupConversationForUser, getGroupMsgsForConversation } from "../controllers/msgs.controller.js";

const router = express.Router();

router.get('/', getMsgsForConversation);

router.post('/group', getGroupMsgsForConversation)

router.post("/getConversationList", getConversationForUser)

router.post("/getGroupConversationList", getGroupConversationForUser)

export default router;