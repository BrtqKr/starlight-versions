import { InputStream, Rescaler } from "@swmansion/smelter";
import Smelter from "@swmansion/smelter-node";

function ExampleApp() {
  return (
    <Rescaler>
      <InputStream inputId="example_input" volume={0.5} />
    </Rescaler>
  );
}

async function run() {
  const smelter = new Smelter();
  await smelter.init();

  await smelter.registerInput("example_input", {
    type: "mp4",
    serverPath: "./inputExample.mp4",
  });

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
    audio: {
      encoder: {
        type: "aac",
        channels: "stereo",
      },
    },
  });

  await smelter.start();
}
void run();
