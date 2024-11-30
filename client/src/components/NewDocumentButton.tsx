import { useState, useTransition } from "react";
import { useUser, useSession } from "@clerk/clerk-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function NewDocumentButton() {
  const [isPending, startTransition] = useTransition();
  const [createDoc, setCreateDoc] = useState(false);
  const { user } = useUser();
  const { session } = useSession();
  const navigate = useNavigate();

  function handlerNewDocument() {
    startTransition(() => {
      (async function createNewDocument() {
        if (!user && !session) {
          alert("User is not authenticated");
          return;
        }

        const sessionClaims = await session?.user;

        const userEmail = sessionClaims?.primaryEmailAddress?.emailAddress;

        if (!userEmail) {
          throw new Error("User email not found");
        }

        try {
          const { data } = await axios.post(
            "/api/v1/document/create-document",
            // "http://192.168.1.8:5001/api/v1/app/create-document",
            {
              userEmail,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          setCreateDoc(false);
          navigate(`/doc/${data.documentId}`);
        } catch (error) {
          if (axios.isAxiosError(error)) {
            console.error(error);
          }
        }
      })();
    });
  }

  return (
    <button
      className="btn btn-neutral w-full"
      onClick={() => {
        handlerNewDocument();
        setCreateDoc(true);
      }}
      disabled={createDoc}
    >
      {createDoc ? "Creating..." : "New Document"}
    </button>
  );
}
export default NewDocumentButton;
