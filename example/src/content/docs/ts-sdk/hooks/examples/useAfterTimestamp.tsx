import { Text, View, useAfterTimestamp } from "@swmansion/smelter";
import { OfflineSmelter } from "@swmansion/smelter-node";

function ExampleApp() {
  const afterTimestamp = useAfterTimestamp(5000);
  return (
    <View>
      {afterTimestamp ? (
        <Text>After 5 second timestamp</Text>
      ) : (
        <Text>Before 5 second timestamp</Text>
      )}
    </View>
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
    audio: {
      encoder: {
        type: "aac",
        channels: "stereo",
      },
    },
  });
}
void run();
