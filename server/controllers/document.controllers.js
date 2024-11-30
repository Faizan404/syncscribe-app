import { adminDb } from "../libs/firebase-admin.js";
import liveblocks from "../libs/liveblock.js";

export const createNewDocument = async (req, res) => {
  try {
    const { userEmail } = req?.body;

    if (!userEmail)
      return res.status(400).json({
        status: "fail",
        message: "User email is required",
      });

    const docCollectionRefs = adminDb.collection("documents");
    const docRefs = await docCollectionRefs.add({
      title: "New Doc",
    });

    await adminDb
      .collection("users")
      .doc(userEmail)
      .collection("rooms")
      .doc(docRefs.id)
      .set({
        userId: userEmail,
        role: "owner",
        createdAt: new Date(),
        roomId: docRefs.id,
      });

    res.status(201).json({
      status: "success",
      documentId: docRefs.id,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to create new document, Some thing went wrong",
    });
  }
};

export const deleteDocument = async (req, res) => {
  try {
    const { id: roomId } = req.params;

    if (!roomId)
      return res.status(400).json({
        status: "fail",
        message: "Room id is required",
      });

    await adminDb.collection("documents").doc(roomId).delete();

    const roomCollectionRefs = await adminDb
      .collectionGroup("rooms")
      .where("roomId", "==", roomId)
      .get();

    const batch = adminDb.batch();

    roomCollectionRefs.forEach((room) => {
      batch.delete(room.ref);
    });

    await batch.commit();

    await liveblocks.deleteRoom(roomId);

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to delete document, Some thing went wrong",
    });
  }
};

export const inviteUserToDocument = async (req, res) => {
  try {
    const { roomId, email } = req.body;

    if (!roomId && !email)
      return res.status(400).json({
        status: "fail",
        message: "Room Id and Email is required",
      });

    await adminDb
      .collection("users")
      .doc(email)
      .collection("rooms")
      .doc(roomId)
      .set({
        userId: email,
        role: "editor",
        createdAt: new Date(),
        roomId: roomId,
      });

    res.status(200).json({
      status: "success",
      data: {
        documentId: roomId,
        email,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to invite user, Some thing went wrong",
    });
  }
};

export const removeInvitedUser = async (req, res) => {
  try {
    const { userId: email, roomId } = req.body;


    await adminDb
      .collection("users")
      .doc(email)
      .collection("rooms")
      .doc(roomId)
      .delete();

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to remove invited user, Some thing went wrong",
    });
  }
};
