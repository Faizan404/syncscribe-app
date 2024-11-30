import { FormEvent, useEffect, useState, useTransition } from "react";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { db } from "../../firebase";
import { doc, updateDoc } from "firebase/firestore";
import DeleteDocument from "./DeleteDocument";
import InviteUser from "./InviteUser";
import useOwner from "../libs/useOwner";
import ManageUsers from "./ManageUsers";
import Avatars from "./Avatars";

function DocumentNavBar({ docId }: { docId: string }) {
  const [input, setInput] = useState("");
  const [isUpdating, startTransition] = useTransition();
  const [data, loading, error] = useDocumentData(doc(db, "documents", docId));
  const isOwner = useOwner();

  useEffect(
    function () {
      if (!data) return;
      setInput(data.title);
    },
    [data]
  );

  function handleUpdateDocument(e: FormEvent) {
    e.preventDefault();
    startTransition(function () {
      (async function () {
        if (input.trim()) {
          await updateDoc(doc(db, "documents", docId), {
            title: input.trim(),
          });
        }
      })();
    });
  }

  return (
    <div>
      <div className="flex max-w-6xl mx-auto justify-center item-center p-2 my-4">
        <form onSubmit={handleUpdateDocument}>
          <div className="join flex justify-center w-full ">
            <input
              className="input input-sm input-bordered join-item w-[50vw]"
              placeholder="Your Document Title..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              disabled={isUpdating}
              type="submit"
              className="btn btn-sm join-item btn-neutral"
            >
              {isUpdating ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
        {isOwner && (
          <>
            <InviteUser docId={docId} />
            <DeleteDocument docId={docId} />
          </>
        )}
      </div>
      <div className="flex max-w-6xl mx-auto justify-around item-center p-2 my-4">
        <ManageUsers />
        <Avatars />
      </div>
    </div>
  );
}
export default DocumentNavBar;
