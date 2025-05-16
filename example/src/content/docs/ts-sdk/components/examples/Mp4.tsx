import { Mp4, Rescaler } from "@swmansion/smelter";
import Smelter from "@swmansion/smelter-node";

function ExampleApp() {
  return (
    <Rescaler>
      <Mp4 source="https://example.com/video.mp4" />
    </Rescaler>
  );
}

async function run() {
  const smelter = new Smelter();
  await smelter.init();

  await smelter.registerOutput("output", <ExampleApp />, {
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

  await smelter.start();
}
void run();
