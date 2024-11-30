import stringToColor from "../libs/stringToColor";

import { motion } from "framer-motion";
import { MousePointer2 } from "lucide-react";

function FollowPointer({
  x,
  y,
  info,
}: {
  x: number;
  y: number;
  info: {
    name: string;
    email: string;
    avatar: string;
  };
}) {
  const color = stringToColor(info.email || "1");

  return (
    <motion.div
      className="h-4 w-4 rounded-full absolute z-50"
      style={{
        top: x,
        left: y,
        pointerEvents: "none",
      }}
      initial={{ scale: 1, opacity: 1 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
    >
      <MousePointer2 color={color} size={32} />
      <motion.div
        style={{
          backgroundColor: color,
          width: "max-content",
          padding: ".3rem .5rem",
          borderRadius: "20px",
          color: "#FFF",
        }}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.5, opacity: 0 }}
      >
        {info?.name || info.email}
      </motion.div>
    </motion.div>
  );
}
export default FollowPointer;
