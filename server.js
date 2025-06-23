const express = require("express");
const { spawn } = require("child_process");
const path = require("path");

const app = express();
const PORT = 3000;

const STREAMS = {
  "102fm": "https://102.livecdn.biz/102fm_aac",
  "eco99fm": "http://eco-live.mediacast.co.il/99fm_aac",

  "radiohaifa": "http://ads11.livecdn.biz:80/radiohaifa",
  
  "jerusalemfm": "https://radio.streamgates.net/stream/101fm",
  "radiodarom":  "https://cdn.cybercdn.live/Darom_97FM/Live/icecast.audio",
  "levhamedina": "https://cdn.cybercdn.live/Lev_Hamedina/Audio/icecast.audio",

  "galgalatz": "https://glzwizzlv.bynetcdn.com/glglz_mp3",
  "galitzahal": "https://glzwizzlv.bynetcdn.com/glz_mp3",

  "kan88": "https://playerservices.streamtheworld.com/api/livestream-redirect/KAN_88.mp3",
  "kanbet": "https://kanbet.media.kan.org.il/hls/live/2024811/2024811/kanbet_mp3/chunklist.m3u8",
  "kangimmel": "https://kangimmel.media.kan.org.il/hls/live/2024813/2024813/kangimmel_mp3/chunklist.m3u8",
  
};

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

  const ffmpegPath = require("ffmpeg-static");
  
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
