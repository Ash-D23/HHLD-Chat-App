import express from "express"
import { addGroup } from "../controllers/groups.controller.js";

const router = express.Router();

router.post('/add', addGroup);

export default router;