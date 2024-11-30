import axios from "axios";
import toast from "react-hot-toast";

import { useState, useTransition } from "react";

function InviteUser({ docId }: { docId: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [invite, setInvite] = useState(false);
  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();

  if (!docId) {
    toast.error("Document ID is required for inviting users.");
    return null;
  }

  function handleInviteUser() {
    startTransition(function () {
      (async function () {
        try {
          const res = await axios.post(`/api/v1/document/invite-user`, {
            roomId: docId,
            email,
          });
          console.log(res);

          setInvite(false);
          toast.success("User invited successfully");
        } catch (error) {
          console.error(error);
          toast.error(error?.response?.data?.message || "An error occurred");
        } finally {
          setIsModalOpen(false);
          setInvite(false);
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
        Invite
      </label>
      <input type="checkbox" id="my_modal_7" className="modal-toggle" />

      {/* Put this part before </body> tag */}
      <div className={`modal ${isModalOpen ? "modal-open" : ""}`} role="dialog">
        <div className="modal-box">
          <h3 className="text-lg font-bold text-center">
            Invite User to Collaborate{" "}
          </h3>
          <p className="py-4 text-center">
            Enter the email of the user you want to invite to collaborate on
            this document.
          </p>
          <input
            type="text"
            placeholder="abc@gmail.com"
            className="input input-bordered input-sm w-full max-w-xs"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            className="btn btn-sm btn-neutral float-right"
            onClick={() => {
              handleInviteUser();
              setInvite(true);
            }}
            disabled={invite}
          >
            {invite ? "Inviting..." : "Invite"}
          </button>
        </div>
        <label className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          Close
        </label>
      </div>
    </div>
  );
}
export default InviteUser;
