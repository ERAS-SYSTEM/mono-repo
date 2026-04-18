import express from "express";
import cors from "cors";
import router from "./routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", router);

const PORT = Number(process.env.PORT ?? 3005);
app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}/api`);
});

