import express from "express";
import dotenv from "dotenv";
import { connectdb } from "./lib/db.js";
import authrouter from "./routes/auth.routes.js";
import userroutes from "./routes/user.routes.js";
import chatroutes from "./routes/chat.routes.js";
import cookieParser from "cookie-parser"; 

dotenv.config();
const app = express();
const port = process.env.PORT;

// ✅ Middleware first
app.use(express.json());
app.use(cookieParser()); // Optional but useful for authentication

// ✅ Then routes
app.use("/auth", authrouter);
app.use("/users", userroutes);
app.use("/chat", chatroutes);

app.listen(port, () => {
  connectdb();
  console.log(`Your app listening on http://localhost:${port}`);
});
