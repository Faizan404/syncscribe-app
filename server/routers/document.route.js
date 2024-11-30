import express from "express";

import { createNewDocument, deleteDocument, inviteUserToDocument, removeInvitedUser } from "../controllers/document.controllers.js";

const router = express.Router();

router.route("/create-document").post(createNewDocument);
router.route("/invite-user").post(inviteUserToDocument);
router.route("/delete-document/:id").delete(deleteDocument);
router.route("/remove-invited-user").delete(removeInvitedUser);

export default router;
