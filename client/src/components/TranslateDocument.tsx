import axios from "axios";
import toast from "react-hot-toast";
import * as Y from "yjs";

import { useState, useTransition } from "react";
import { Languages } from "lucide-react";
import { Bot } from "lucide-react";
import Markdown from "react-markdown";

type Language =
  | "french"
  | "spanish"
  | "german"
  | "italian"
  | "urdu"
  | "arabic"
  | "hindi";

const languages: Language[] = [
  "french",
  "spanish",
  "german",
  "italian",
  "urdu",
  "arabic",
  "hindi",
];

function TranslateDocument({ doc }: { doc: Y.Doc }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [translate, setTranslate] = useState(false);
  const [translateLanguage, setTranslateLanguage] = useState("");
  const [summary, setSummary] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleTranslate() {
    startTransition(function () {
      (async function () {
        try {
          console.log({
            documentContent: JSON.stringify(doc.get("document-store").toJSON()),
            targetLanguage: translateLanguage,
          });

          const res = await axios.post(
            `${import.meta.env.VITE_PUBLIC_BASE_URL}/translate-summary`,
            // `http://127.0.0.1:8787/translate-summary`,
            {
              data: {
                documentContent: doc.get("document-store").toJSON(),
                targetLanguage: translateLanguage,
              },
            }
          );
          setSummary(res.data.translated_text);
          toast.success("Document translated successfully");
        } catch (error) {
          console.error(error);
          toast.error(error?.response?.data?.message || "An error occurred");
        } finally {
          setTranslate(false);
        }
      })();
    });
  }

  return (
    <div>
      {/* The button to open modal */}
      <label className="btn mx-1" onClick={() => setIsModalOpen(true)}>
        <Languages />
        Translate
      </label>
      <input type="checkbox" id="my_modal_7" className="modal-toggle" />

      {/* Put this part before </body> tag */}
      <div className={`modal ${isModalOpen ? "modal-open" : ""}`} role="dialog">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Translate the Document </h3>
          <p className="py-4">
            Select the language and AI will translate the document to the
            selected language.
          </p>
          {summary ? (
            <div className="flex flex-col items-start max-h-96 overflow-y-scroll gap-2 p-5 bg-gray-100">
              <div className="flex">
                <Bot />
                <p className="font-bold">
                  GPT {isPending ? "is thinking..." : "Says:"}
                </p>
              </div>
              <div>
                {isPending ? "Thinking..." : <Markdown>{summary}</Markdown>}
              </div>
            </div>
          ) : (
            <>
              <select
                className="select select-sm w-full max-w-xs"
                value={translateLanguage}
                onChange={(e) => setTranslateLanguage(e.target.value)}
              >
                <option value="">Select Language</option>
                {languages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang.toUpperCase()}
                  </option>
                ))}
              </select>
              <button
                className="btn btn-sm btn-neutral float-right"
                onClick={() => {
                  handleTranslate();
                  setTranslate(true);
                }}
                disabled={translate || !translateLanguage}
              >
                {translate ? "Translating..." : "Translate"}
              </button>
            </>
          )}
        </div>
        <label
          className="modal-backdrop"
          onClick={() => {
            setIsModalOpen(false);
            setSummary("");
            setTranslateLanguage("");
          }}
        >
          Close
        </label>
      </div>
    </div>
  );
}
export default TranslateDocument;
