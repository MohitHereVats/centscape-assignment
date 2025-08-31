import express from "express";
import cors from "cors";
import previewRouter from "./routes/preview";
import { errorHandler } from "./middleware/errorHandler";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Centscape Preview Server is running!");
});

app.use("/preview", previewRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Import the app for testing
export default app;
