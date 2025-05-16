import { View } from "@swmansion/smelter";
import Smelter from "@swmansion/smelter-node";

function ExampleApp() {
  return (
    <View>
      <View style={{ direction: "column" }}>
        <View style={{ backgroundColor: "red", height: 200 }} />
        <View style={{ backgroundColor: "blue" }} />
      </View>
      <View style={{ backgroundColor: "green" }} />
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
  });

  await smelter.start();
}
void run();
