import express from "express"
import verifyToken from "../middleware/verifyToken.js";
import { getGroups } from "../controllers/groups.controller.js";

const router = express.Router();

router.get('/', verifyToken, getGroups);

export default router;