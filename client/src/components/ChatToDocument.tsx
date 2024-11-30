import axios from "axios";
import toast from "react-hot-toast";
import * as Y from "yjs";

import { useState, useTransition } from "react";
import { MessagesSquare } from "lucide-react";
import Markdown from "react-markdown";

function ChatToDocument({ doc }: { doc: Y.Doc }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [question, setQuestion] = useState("");
  const [chatResponse, setChatResponse] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleChatToDocument() {
    startTransition(function () {
      (async function () {
        try {
          const res = await axios.post(
            // `${import.meta.env.VITE_PUBLIC_BASE_URL}/chat-to-document`,
            `http://127.0.0.1:8787/chat-to-document`,
            {
              data: {
                documentContent: doc.get("document-store").toJSON(),
                question,
              },
            }
          );
          console.log(res);
          setChatResponse(res.data.message);
          toast.success("Processing completed");
        } catch (error) {
          console.error(error);
          toast.error(error?.response?.data?.message || "An error occurred");
        } finally {
          setProcessing(false);
        }
      })();
    });
  }

  return (
    <div>
      {/* The button to open modal */}
      <label className="btn mx-1" onClick={() => setIsModalOpen(true)}>
        <MessagesSquare />
        Chat to Document
      </label>
      <input type="checkbox" id="my_modal_7" className="modal-toggle" />

      {/* Put this part before </body> tag */}
      <div className={`modal ${isModalOpen ? "modal-open" : ""}`} role="dialog">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Chat to Document </h3>
          <p className="py-4">
            Ask questions about the document and AI will answer them.
          </p>
          {chatResponse ? (
            <div className="flex flex-col items-start max-h-96 overflow-y-scroll gap-2 p-5 bg-gray-100">
              <div className="flex">
                <MessagesSquare />
                <p className="font-bold">
                  GPT {isPending ? "is thinking..." : "Says:"}
                </p>
              </div>
              <div>
                {isPending ? (
                  "Thinking..."
                ) : (
                  <Markdown>{chatResponse}</Markdown>
                )}
              </div>
            </div>
          ) : (
            <>
              <textarea
                placeholder="Ask me question?"
                className="textarea textarea-bordered textarea-xs w-full max-w-xs"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              ></textarea>
              <button
                className="btn btn-md btn-neutral float-right"
                onClick={() => {
                  handleChatToDocument();
                  setProcessing(true);
                }}
                disabled={!question || processing}
              >
                {processing ? "Asking..." : "Ask"}
              </button>
            </>
          )}
        </div>
        <label
          className="modal-backdrop"
          onClick={() => {
            setIsModalOpen(false);
            setChatResponse("");
            setQuestion("");
          }}
        >
          Close
        </label>
      </div>
    </div>
  );
}
export default ChatToDocument;
