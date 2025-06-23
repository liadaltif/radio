import express from "express";
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import ffmpegPath from "ffmpeg-static";
import STREAMS from "./streams.js";

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));

app.get("/stream/:station", (req, res) => {
  const stationKey = req.params.station.toLowerCase();
  const url = STREAMS[stationKey];

  if (!url) return res.status(404).send("Station not found");

  res.set({
    "Content-Type": "audio/mpeg",
    "Transfer-Encoding": "chunked",
    "Cache-Control": "no-cache"
  });

  const ffmpeg = spawn(ffmpegPath, [
    "-loglevel", "error",
    "-fflags", "nobuffer",
    "-flags", "low_delay",
    "-i", url,
    "-f", "mp3",
    "-codec:a", "libmp3lame",
    "-b:a", "128k",
    "-"
  ]);

  ffmpeg.stdout.pipe(res);

  req.on("close", () => {
    ffmpeg.kill("SIGKILL");
  });
});

app.listen(PORT, () => {
  console.log(`🌐 App running at http://localhost:${PORT}`);
});
