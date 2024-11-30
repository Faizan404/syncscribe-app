import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import documentRoute from "./routers/document.route.js";
import roomAuthRoute from "./routers/roomAuth.route.js";

const app = express();

dotenv.config();

app.use(express.json());

app.use(
  cors({
    // origin: "http://localhost:5173",
    origin: "http://192.168.1.8:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use("/api/v1/document", documentRoute);
app.use("/api/v1/room", roomAuthRoute);

app.listen(process.env.PORT ?? 5001, "0.0.0.0",  function () {
  console.log(`Server is running on PORT: ${process.env.PORT}`);
});

export default app;
