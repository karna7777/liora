import app from "./app.js"
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
dotenv.config();
const PORT = process.env.PORT || 8000

// Middleware
app.use(cors({
  origin: ["https://liora-inky.vercel.app", "http://localhost:5173"]
}));

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/auth", authRoutes);

app.listen(PORT, ()=>{
    console.log(`Server running on port http://localhost:${PORT}`);
})
