import { Liveblocks } from "@liveblocks/node";
import dotenv from "dotenv";

dotenv.config();

const SECRET_KEY = process.env.LIVEBLOCK_PRIVATE_SECRET_KEY;

if (!SECRET_KEY) throw new Error("Secret key is not set");

const liveblocks = new Liveblocks({
  secret: SECRET_KEY,
});

export default liveblocks;
