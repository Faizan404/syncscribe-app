import {
  RoomProvider as RoomProviderWrapper,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";

import Spinner from "./Spinner";
import LiveCursorProvider from "./LiveCursorProvider";
import { ReactNode } from "react";
import LiveBlockProvider from "./LiveBlockProvider";

function RoomProvider({
  roomId,
  children,
}: {
  roomId: string;
  children: ReactNode;
}) {
  return (
    <LiveBlockProvider>
      <RoomProviderWrapper id={roomId} initialPresence={{ cursor: null }}>
        <ClientSideSuspense fallback={<Spinner />}>
          <LiveCursorProvider>{children}</LiveCursorProvider>
        </ClientSideSuspense>
      </RoomProviderWrapper>
    </LiveBlockProvider>
  );
}
export default RoomProvider;
