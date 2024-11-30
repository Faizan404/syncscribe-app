import { ReactNode } from "react";
import RoomProvider from "../components/RoomProvider";

import { useAuth } from "@clerk/clerk-react";
import Spinner from "../components/Spinner";

function DocumentLayout({
  docId,
  children,
}: {
  docId: string;
  children: ReactNode;
}) {
  const { isSignedIn } = useAuth();

  if (!isSignedIn) return <Spinner />;

  return <RoomProvider roomId={docId}>{children}</RoomProvider>;
}
export default DocumentLayout;
