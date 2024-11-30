import express from "express";

import { userRoomAuthController } from "../controllers/roomAuth.controllers.js";

const router = express.Router();

router.route("/auth-endpoint").post(userRoomAuthController);

export default router;