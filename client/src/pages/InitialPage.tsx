import { CircleArrowLeft } from "lucide-react";

function InitialPage() {
  return (
    <div className="flex space-x-2 items-center animate-pulse">
      <span>
        <CircleArrowLeft />
      </span>
      <h1 className="font-bold text-xl md:text-2xl">
        Get started with creating a New Document
      </h1>
    </div>
  );
}
export default InitialPage;
