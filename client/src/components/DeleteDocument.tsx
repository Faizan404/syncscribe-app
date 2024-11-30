import axios from "axios";
import { useState, useTransition } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function DeleteDocument({ docId }: { docId: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteDoc, setDeleteDoc] = useState(false);
  const [isDeleting, startDeleting] = useTransition();
  const navigate = useNavigate();

  if (!docId) {
    toast.error("Document ID is required for deletion.");
    return null;
  }

  function handleDeleteDocument() {
    startDeleting(function () {
      (async function () {
        try {
          await axios.delete(`/api/v1/document/delete-document/${docId}`);
          setDeleteDoc(false);
          navigate("/");
          toast.success("Document deleted successfully");
        } catch (error) {
          console.error(error);
          toast.error(error?.response?.data?.message || "An error occurred");
        } finally {
          setIsModalOpen(false);
        }
      })();
    });
  }

  return (
    <div>
      {/* The button to open modal */}
      <label
        className="btn btn-sm btn-error"
        onClick={() => setIsModalOpen(true)}
      >
        Delete
      </label>
      <input type="checkbox" id="my_modal_7" className="modal-toggle" />

      {/* Put this part before </body> tag */}
      <div className={`modal ${isModalOpen ? "modal-open" : ""}`} role="dialog">
        <div className="modal-box">
          <h3 className="text-lg font-bold">
            Are you sure you want to delete this document?
          </h3>
          <p className="py-4">
            This will delete the document and all its contents, removing all the
            users from the document.
          </p>
          <button
            className="btn btn-error float-right"
            onClick={() => {
              handleDeleteDocument();
              setDeleteDoc(true);
            }}
            disabled={deleteDoc}
          >
            {deleteDoc ? "Deleting..." : "Delete"}
          </button>
        </div>
        <label className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          Close
        </label>
      </div>
    </div>
  );
}
export default DeleteDocument;
