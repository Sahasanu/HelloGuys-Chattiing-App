import express from 'express';
import { protectroute } from '../middleware/middleware.js';
import {getstreamToken} from "../controllers/chat.controller.js"
const router = express.Router();
router.get('/token', protectroute,getstreamToken)

export default router;