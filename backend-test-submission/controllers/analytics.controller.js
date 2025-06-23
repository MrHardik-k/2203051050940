import fs from "fs";
import path from "path";
import { Log } from "../../logging-middleware/log.js";

const dbPath = path.resolve("./data/db.json");

export async function getAllAnalytics(req, res) {
  let data = [];
  try {
    const raw = fs.readFileSync(dbPath, "utf-8");
    data = JSON.parse(raw);
  } catch (err) {
    await Log("backend", "error", "handler", "Failed to read DB for analytics");
    return res.status(500).json({ error: "Could not load analytics" });
  }

  const analytics = data.map((entry) => ({
    longUrl: entry.url,
    shortUrl: `http://localhost:5000/${entry.shortcode}`,
    hitCount: entry.clicks.length,
  }));

  await Log("backend", "info", "handler", "Fetched all analytics");
  return res.json(analytics);
}
