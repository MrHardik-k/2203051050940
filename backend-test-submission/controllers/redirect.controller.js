import fs from "fs";
import path from "path";
import { Log } from "../../logging-middleware/log.js";

const dbPath = path.resolve("./data/db.json");

export async function handleRedirect(req, res) {
  const { shortcode } = req.params;
  let data = [];

  try {
    const content = fs.readFileSync(dbPath, "utf-8");
    data = JSON.parse(content);
  } catch (err) {
    await Log(
      "backend",
      "error",
      "handler",
      `Failed to load DB: ${err.message}`
    );
    return res.status(500).json({ error: "Failed to load DB" });
  }

  const idx = data.findIndex((e) => e.shortcode === shortcode);
  if (idx === -1) {
    await Log(
      "backend",
      "error",
      "handler",
      `Shortcode not found: ${shortcode}`
    );
    return res.status(404).json({ error: "Shortcode not found" });
  }

  const entry = data[idx];
  const now = new Date();

  if (new Date(entry.expiry) < now) {
    await Log("backend", "warn", "handler", `Shortcode expired: ${shortcode}`);
    return res.status(410).json({ error: "Shortcode expired" });
  }

  const analyticsEntry = {
    timestamp: now.toISOString(),
    ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
  };
  entry.clicks.push(analyticsEntry);
  data[idx] = entry;
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

  await Log(
    "backend",
    "info",
    "handler",
    `Redirected: ${shortcode} → ${entry.url}`
  );

  return res.redirect(entry.url);
}
