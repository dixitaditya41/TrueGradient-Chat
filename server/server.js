import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import router from "./routes/index.js";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import { initSocket } from "./utils/socket.js";
import http from "http";
dotenv.config();

const app = express();

// Middleware
app.use(cors(
  {
    origin: ['https://true-gradient-chat.vercel.app'],
    credentials: true,
  }
));

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api", router);
app.get("/health", (req, res) => res.send("Server is healthy"));

const PORT = process.env.PORT || 5000;

connectDB().then(async () => {
  const server = http.createServer(app);
  initSocket(server);
  server.listen(PORT, () => console.log(`🚀 Server listening on port ${PORT}`));

}).catch((err) => {
  console.log(err);
});

export default app;

 
