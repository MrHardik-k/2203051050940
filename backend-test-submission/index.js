import express from "express";
import cors from "cors";
import shortUrlRoutes from "./routes/shortUrl.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";
import redirectRoutes from "./routes/redirect.routes.js";
import { Log } from "../logging-middleware/log.js";

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.use("/shorturls", shortUrlRoutes);
app.use("/analytics", analyticsRoutes);
app.use("/", redirectRoutes);

app.use((req, res) => res.status(404).json({ error: "Not Found" }));

app.listen(5000, () => {
  Log("Backend running on http://localhost:5000");
});
