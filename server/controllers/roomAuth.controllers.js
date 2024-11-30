import { adminDb } from "../libs/firebase-admin.js";
import liveblocks from "../libs/liveblock.js";

export const userRoomAuthController = async (req, res) => {
  const {
    room,
    user: { fullName, imageUrl, primaryEmailAddress },
  } = req.body;
  
  const session = liveblocks.prepareSession(primaryEmailAddress.emailAddress, {
    userInfo: {
      name: fullName,
      email: primaryEmailAddress.emailAddress,
      avatar: imageUrl,
    },
  });

  const usersInRoom = await adminDb
    .collection("users")
    .doc(primaryEmailAddress.emailAddress)
    .collection("rooms")
    .where("userId", "==", primaryEmailAddress.emailAddress)
    .get();

  const userInRoom = usersInRoom.docs.find((doc) => doc.id == room);

  if (!userInRoom?.exists)
    return res.status(401).json({
      status: "fail",
      message: "Unauthorize - You are not allow to enter in this room",
    });

  session.allow(room, session.FULL_ACCESS);
  const { body, status } = await session.authorize();

  res.status(200).json({
    status,
    body,
  });
};
