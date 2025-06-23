import fs from "fs";
import path from "path";
import { Log } from "../../logging-middleware/log.js";
import { generateShortCode } from "../utils/shortCodeGenerator.util.js";

const dbPath = path.resolve("./data/db.json");

export const createShortUrl = async (req, res) => {
  const { url, validity, shortcode } = req.body;

  if (!url) {
    await Log("backend", "error", "handler", "Missing URL in request");
    return res.status(400).json({ error: "URL is required" });
  }

  const short = shortcode || generateShortCode();
  const expiry = new Date(
    Date.now() + (validity || 30) * 60 * 1000
  ).toISOString();

  let data = [];
  try {
    const content = fs.readFileSync(dbPath, "utf-8");
    data = JSON.parse(content);
  } catch (err) {}

  if (data.find((entry) => entry.shortcode === short)) {
    await Log("backend", "warn", "handler", "Shortcode already in use");
    return res.status(409).json({ error: "Shortcode already in use" });
  }

  const newEntry = {
    url,
    shortcode: short,
    expiry,
    createdAt: new Date().toISOString(),
    clicks: [],
  };

  data.push(newEntry);
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

  await Log("backend", "info", "handler", `Short URL created: ${short}`);

  return res.status(201).json({
    shortLink: `http://localhost:5000/${short}`,
    expiry,
  });
};

export async function getUrlStats(req, res) {
  const { shortcode } = req.params;
  let data = [];

  try {
    const raw = fs.readFileSync(dbPath, "utf-8");
    data = JSON.parse(raw);
  } catch (err) {
    await Log(
      "backend",
      "error",
      "handler",
      `Failed to read DB: ${err.message}`
    );
    return res.status(500).json({ error: "Could not load data" });
  }

  const entry = data.find((e) => e.shortcode === shortcode);
  if (!entry) {
    await Log(
      "backend",
      "warn",
      "handler",
      `Stats requested for non-existent shortcode: ${shortcode}`
    );
    return res.status(404).json({ error: "Shortcode not found" });
  }

  const response = {
    originalUrl: entry.url,
    createdAt: entry.createdAt,
    expiresAt: entry.expiry,
    clickCount: entry.clicks.length,
    clickDetails: entry.clicks.map((click) => ({
      timestamp: click.timestamp,
      referrer: click.referrer || "unknown",
      geoLocation: click.geoLocation || "unknown",
    })),
  };

  await Log("backend", "info", "handler", `Fetched stats for ${shortcode}`);

  return res.json(response);
}
