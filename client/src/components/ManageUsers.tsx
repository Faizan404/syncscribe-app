import axios from "axios";
import toast from "react-hot-toast";

import { useState, useTransition } from "react";
import { useUser } from "@clerk/clerk-react";
import { collectionGroup, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import { useRoom } from "@liveblocks/react";
import useOwner from "../libs/useOwner";

function ManageUsers() {
  const { user } = useUser();
  const room = useRoom();
  const isOwner = useOwner();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isRemoving, setIsRemoving] = useState(false);

  const [userInRoom] = useCollection(
    user && query(collectionGroup(db, "rooms"), where("roomId", "==", room.id))
  );

  function handleRemoveUser(userId: string, roomId: string) {
    startTransition(function () {
      (async function () {
        try {
          await axios.delete(`/api/v1/document/remove-invited-user`, {
            data: {
              userId,
              roomId,
            },
          });
          toast.success("Invited user removed successfully");
        } catch (error) {
          console.error(error);
          toast.error(error?.response?.data?.message || "An error occurred");
        } finally {
          setIsModalOpen(false);
          setIsRemoving(false);
        }
      })();
    });
  }

  return (
    <div>
      {/* The button to open modal */}
      <label
        className="btn btn-outline btn-sm mx-1"
        onClick={() => setIsModalOpen(true)}
      >
        Users ({userInRoom?.docs.length})
      </label>
      <input type="checkbox" id="my_modal_7" className="modal-toggle" />

      {/* Put this part before </body> tag */}
      <div className={`modal ${isModalOpen ? "modal-open" : ""}`} role="dialog">
        <div className="modal-box">
          <h3 className="text-lg font-bold text-center">User with Access </h3>
          <p className="py-4 text-center">
            Below the list of users who have access to this document.
          </p>
          <hr />
          <ul className="mt-2">
            {userInRoom?.docs.map((userDoc) => (
              <li
                className="flex justify-between items-center hover:bg-gray-100 rounded-md p-1"
                key={userDoc.data().userId}
              >
                <p className="text-md font-semibold">
                  {userDoc.data().userId ===
                  user?.emailAddresses[0].emailAddress
                    ? `You ( ${userDoc.data().userId} )`
                    : userDoc.data().userId}
                </p>
                <div>
                  <button className="btn btn-sm">{userDoc.data().role}</button>
                  {isOwner &&
                    userDoc.data().userId !==
                      user?.emailAddresses[0].emailAddress && (
                      <button
                        className="btn btn-sm btn-outline btn-error ml-2"
                        onClick={() => {
                          handleRemoveUser(
                            userDoc.data().userId,
                            userDoc.data().roomId
                          );
                          setIsRemoving(true);
                        }}
                        disabled={isRemoving}
                      >
                        {isRemoving ? "Removing..." : "Remove"}
                      </button>
                    )}
                </div>
              </li>
            ))}
          </ul>
        </div>
        <label className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          Close
        </label>
      </div>
    </div>
  );
}
export default ManageUsers;
