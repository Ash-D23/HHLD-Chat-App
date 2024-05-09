import express from "express"
import verifyToken from "../middleware/verifyToken.js";
import getUsers, { updateUserStatus } from "../controllers/users.controller.js";

const router = express.Router();

router.get('/', verifyToken, getUsers);

router.post('/updateStatus', updateUserStatus)

export default router;