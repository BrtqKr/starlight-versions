import { View, WebView } from "@swmansion/smelter";
import Smelter from "@swmansion/smelter-node";

function ExampleApp() {
  return (
    <View>
      <WebView instanceId="example_web_renderer" />
    </View>
  );
}

async function run() {
  const smelter = new Smelter();
  await smelter.init();

  await smelter.registerWebRenderer("example_web_renderer", {
    url: "https://smelter.dev",
    resolution: {
      width: 1920,
      height: 1080,
    },
    embeddingMethod: "chromium_embedding",
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
  });

  await smelter.start();
}
void run();
