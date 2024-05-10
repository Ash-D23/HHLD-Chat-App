import express from "express"
import { addGroup, getGroups } from "../controllers/groups.controller.js";

const router = express.Router();

router.post('/add', addGroup);

router.post('/', getGroups);

export default router;