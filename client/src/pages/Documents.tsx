import { useParams } from "react-router-dom";
import DocumentLayout from "./DocumentLayout";
import DocumentNavBar from "../components/DocumentNavBar";
import Editor from "../components/Editor";

function Documents() {
  const { id } = useParams();

  return (
    <div className="flex-1 h-full bg-white p-5">
    <DocumentLayout docId={id}>
      <DocumentNavBar docId={id || ""} />
      <hr />
      <div className="min-h-screen p-2">
        <Editor />
      </div>
    </DocumentLayout>
    </div>
  );
}
export default Documents;
