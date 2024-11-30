// react imports
import { useEffect, useState } from "react";
// 3rd party imports
import { useUser } from "@clerk/clerk-react";
import { useCollection } from "react-firebase-hooks/firestore";
import {
  collectionGroup,
  DocumentData,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";
// components
import NewDocumentButton from "./NewDocumentButton";
import SideBarDocOptions from "./SideBarDocOptions";
// lucid icons
import { AlignJustify } from "lucide-react";
import Spinner from "./Spinner";
import { NavLink } from "react-router-dom";

interface RoomDocument extends DocumentData {
  createdAt: string;
  role: "owner" | "editor";
  roomId: string;
  userId: string;
}

function SideBar() {
  const { user } = useUser();
  const [data, loading, error] = useCollection(
    user &&
      query(
        collectionGroup(db, "rooms"),
        where("userId", "==", user.emailAddresses[0].toString())
      )
  );

  const [groupedData, setGroupedData] = useState<{
    owner: RoomDocument[];
    editor: RoomDocument[];
  }>({
    owner: [],
    editor: [],
  });

  useEffect(
    function () {
      if (!data) return;
      const grouped = data?.docs.reduce<{
        owner: RoomDocument[];
        editor: RoomDocument[];
      }>(
        (acc, crr) => {
          const roomData = crr.data() as RoomDocument;

          if (roomData.role === "owner") {
            acc.owner.push({
              id: crr.id,
              ...roomData,
            });
          } else {
            acc.editor.push({
              id: crr.id,
              ...roomData,
            });
          }

          return acc;
        },
        { owner: [], editor: [] }
      );

      setGroupedData(grouped);
    },
    [data]
  );

  const menuOptions = (
    <>
      <NewDocumentButton />
      <div>
        <h2 className="text-gray-500 font-semibold text-sm my-2">
          My Documents
        </h2>
        {groupedData.owner.length === 0 ? (
          <h2 className="text-gray-500 font-semibold text-sm text-center">No Documents</h2>
        ) : (
          <ul className="flex flex-col justify-stretch	 my-4 gap-2">
            {groupedData.owner.map((data) => (
              <SideBarDocOptions key={data.roomId} id={data.id} />
            ))}
          </ul>
        )}
        <h2 className="text-gray-500 font-semibold text-sm my-2">
          Shared with me
        </h2>
        {groupedData.editor.length === 0 ? (
          <h2 className="text-gray-500 font-semibold text-sm text-center">No Documents</h2>
        ) : (
          <ul className="flex flex-col justify-stretch mt-4 gap-2">
            {groupedData.editor.map((data) => (
              <SideBarDocOptions key={data.roomId} id={data.id} />
            ))}
          </ul>
        )}
      </div>
    </>
  );

  return (
    <div className="bg-gray-200 p-2 md:p-4 relative z-10">
      <div className="hidden md:inline">{menuOptions}</div>
      <div className="md:hidden">
        <div className="drawer">
          <input id="my-drawer" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content">
            {/* Page content here */}
            <label
              htmlFor="my-drawer"
              className="btn btn-neutral drawer-button"
            >
              <AlignJustify />
            </label>
          </div>
          <div className="drawer-side">
            <label
              htmlFor="my-drawer"
              aria-label="close sidebar"
              className="drawer-overlay"
            ></label>
            <div className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
              {/* Sidebar content here */}
              <h1 className="text-xl font-semibold text-center mb-6">Menu</h1>
              {menuOptions}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default SideBar;
