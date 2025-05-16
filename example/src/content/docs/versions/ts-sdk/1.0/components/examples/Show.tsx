import { Mp4, Show, Tiles } from "@swmansion/smelter";
import { OfflineSmelter } from "@swmansion/smelter-node";

function ExampleApp() {
  return (
    <Tiles
      style={{ backgroundColor: "#52505b" }}
      transition={{ durationMs: 300 }}>
      <Mp4 source="https://example.com/video1.mp4" />
      <Show delayMs={2000}>
        <Mp4 source="https://example.com/video2.mp4" />
      </Show>
      <Show timeRangeMs={{ start: 5000, end: 8000 }}>
        <Mp4 source="https://example.com/video3.mp4" />
      </Show>
    </Tiles>
  );
}

async function run() {
  const smelter = new OfflineSmelter();
  await smelter.init();

  await smelter.render(<ExampleApp />, {
    type: "mp4",
    serverPath: "./output.mp4",
    video: {
      encoder: {
        type: "ffmpeg_h264",
        preset: "ultrafast",
      },
      resolution: {
        width: 1920,
        height: 1080,
      },
    },
  });
}
void run();
