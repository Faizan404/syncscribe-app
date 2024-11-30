import { ReactNode } from "react";
import { LiveblocksProvider } from "@liveblocks/react/suspense";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";

interface CustomAuthenticationResult {
  userId?: string;
  email?: string;
  room?: string; // Add this line
}

function LiveBlockProvider({ children }: { children: ReactNode }) {
  const { getToken } = useAuth();
  const { user } = useUser();

  const PUBLIC_KEY = import.meta.env.VITE_LIVEBLOCK_PUBLIC_API_KEY;

  if (!PUBLIC_KEY) throw new Error("public key isn't set correctly");

  async function handlerRoomAuthEndPoint(
    room?: string
  ): Promise<CustomAuthenticationResult> {
    // Get the Clerk authentication token
    const clerkToken = await getToken();

    // Fetch Liveblocks room authentication
    const response = await axios.post(
      "/api/v1/room/auth-endpoint",
      // "http://192.168.1.8:5001/api/v1/room/auth-endpoint",
      {
        room,
        user,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${clerkToken}`,
        },
      }
    );

    // Handle the response from your backend
    if (response.status !== 200) {
      throw new Error("Failed to authenticate");
    }

    const { data } = response;
    
    const token = JSON.parse(data.body);

    return token;
  }

  return (
    <LiveblocksProvider throttle={16} authEndpoint={handlerRoomAuthEndPoint}>
      {children}
    </LiveblocksProvider>
  );
}
export default LiveBlockProvider;
