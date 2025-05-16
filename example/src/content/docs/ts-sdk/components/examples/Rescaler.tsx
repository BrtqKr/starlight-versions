import { Image, Rescaler, View } from "@swmansion/smelter";
import Smelter from "@swmansion/smelter-node";

function ExampleApp() {
  return (
    <View style={{ backgroundColor: "#52505b" }}>
      <Rescaler>
        <Image source="https://example.com/image.png" />
      </Rescaler>
      <Rescaler style={{ rescaleMode: "fill" }}>
        <Image source="https://example.com/image.png" />
      </Rescaler>
    </View>
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
