import express from "express"
import getMsgsForConversation, { getGroupMsgsForConversation } from "../controllers/msgs.controller.js";

const router = express.Router();

router.get('/', getMsgsForConversation);

router.post('/group', getGroupMsgsForConversation)

export default router;