import { useUser } from "@clerk/clerk-react";
import { collectionGroup, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../../firebase";
import { useRoom } from "@liveblocks/react/suspense";

export default function useOwner() {
  const { user } = useUser();
  const room = useRoom();
  const [isOwner, setIsOwner] = useState<boolean>(false);

  // query to get the user in the roomId
  const [userInRoom] = useCollection(
    user && query(collectionGroup(db, "rooms"), where("roomId", "==", room.id))
  );

  // check if the user is the owner of the room
  useEffect(() => {
    // if the user is in the room
    if (userInRoom?.docs && userInRoom.docs.length > 0) {
      // get the owners of the room
      const owners = userInRoom.docs.filter(
        (user) => user.data().role === "owner"
      );

      // check if the user is the owner of the room
      if (
        owners.some(
          (owner) => owner.data().userId === user?.emailAddresses[0].toString()
        )
      )
        setIsOwner(true);
    }
  }, [userInRoom, user]);

  return isOwner;
}
